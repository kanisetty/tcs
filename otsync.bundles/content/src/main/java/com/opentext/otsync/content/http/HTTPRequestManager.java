package com.opentext.otsync.content.http;

import com.opentext.otag.api.shared.types.message.SettingsChangeMessage;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.otag.sdk.handlers.AbstractSettingChangeHandler;
import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.otag.SettingsService;
import com.opentext.otsync.content.ws.ServletUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.*;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.opentext.otsync.content.ContentServiceConstants.CS_CONNECTIONS_MAX;

public class HTTPRequestManager {

    private static final Log log = LogFactory.getLog(HTTPRequestManager.class);

    public static final String ZERO_BYTE_ERROR_RESPONSE = "{\"auth\"=true,\"ok\"=false,\"errMsg\"=\"Cannot upload zero-byte file.\",\"info\":{\"auth\"=true,\"ok\"=false,\"errMsg\"=\"Cannot upload zero-byte file.\"}}";

    private static final String MISSING_COOKIE_ERROR = "Missing or invalid Cookie: Failed to extract cookie data from request.";

    private static final ThreadSafeClientConnManager connectionManager = new ThreadSafeClientConnManager();
    private static SettingsService settingsService;

    // listens for Gateway messages regarding the CS thread pool max size
    @SuppressWarnings("unused")
    public static class CsConnectionMaxListener extends AbstractSettingChangeHandler {
        public CsConnectionMaxListener() {
            log.info("Created CsConnectionMaxListener");
        }
        @Override
        public String getSettingKey() {
            return CS_CONNECTIONS_MAX;
        }
        @Override
        public void onSettingChanged(SettingsChangeMessage message) {
            log.info("CS connection max was updated, setting connection pool size");
            setConnectionPool();
        }
    }

    public class ResponseWithStatus {
        public String response;
        public StatusLine status;
    }

    private class HttpRequestPair {
        public HttpRequestPair(HttpUriRequest request, HttpResponse response) {
            this.request = request;
            this.response = response;
        }

        public HttpUriRequest request;
        public HttpResponse response;
    }

    public HTTPRequestManager(SettingsService configSettingService) {
        settingsService = configSettingService;
        setConnectionPool();
    }

    private static void setConnectionPool() {
        connectionManager.setDefaultMaxPerRoute(settingsService.getCSConnectionPoolSize());
        connectionManager.setMaxTotal(settingsService.getCSConnectionPoolSize());
    }

    public String postData(String serverUrl, Map<String, String> parameters, HttpServletRequest incoming) throws IOException {

        // prepare the post arguments as an http entity
        UrlEncodedFormEntity entity = encodeParameters(parameters);
        HttpPost httpPost = new HttpPost(serverUrl);
        httpPost.setEntity(entity);
        httpPost.setParams(getFrontChannelParams());

        // send the request and get the response
        return completeRequest(httpPost, incoming);
    }

    /**
     * Use for file downloads. Sets the given cookie, just for this request (other threads should be unaffected),
     * and streams the results of the GET request directly back via the servlet response.
     *
     * @param url             The exact URL to download, including any parameters
     * @param servletResponse
     * @throws IOException
     */
    public void streamGetResponseWithHeaders(String url, HttpServletResponse servletResponse, CSForwardHeaders headers) throws IOException {
        HttpRequestPair requestPair = doGETWithHeaders(url, headers);
        try {
            duplicateResponse(servletResponse, requestPair.response);
        } catch (IOException e) {
            requestPair.request.abort();
            throw e;
        }
    }

    public HttpRequestPair doGETWithHeaders(String url, CSForwardHeaders headers) throws IOException {
        HttpContext httpContext = new BasicHttpContext();
        DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);

        // send the request using the local cookie, disallowing redirects
        HttpUriRequest request = new HttpGet(url);
        request.setParams(ConnectionProfileManager.getDownloadParams());

        // set headers for Content Server validation
        headers.addTo(request);
        headers.getLLCookie().addLLCookieToRequest(httpClient, request);

        HttpResponse httpResponse = httpClient.execute(request, httpContext);

        return new HttpRequestPair(request, httpResponse);
    }

    /**
     * Use for file uploads assembled in the Engine. Creates and sends a multipart post with the given parameters followed
     * by the given input stream as the file content. The response is streamed back directly.
     *
     * @param stream       stream of file content, ideally streamed in from the request
     * @param params       map of keys and values to send
     * @param filePartName key for file part (e.g. versionFile)
     * @param filename     name of file being uploaded
     * @param filesize     size of file part (from Part.getSize())
     * @param headers      taken from the the client's request
     * @param response     server response will be written directly to this response
     * @throws IOException
     * @throws IOException
     */
    public void forwardMultiPartPost(
            InputStream stream,
            Map<String, String> params,
            String filePartName,
            String filename,
            long filesize,
            CSForwardHeaders headers,
            HttpServletResponse response) throws IOException {

        DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);
        ContentBody filePart = new FixedInputStreamBody(stream, filename, filesize);

        MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE, null, Charset.forName("UTF-8"));

        for (Map.Entry<String, String> param : params.entrySet()) {
            entity.addPart(param.getKey(), new StringBody(param.getValue()));
        }

        entity.addPart(filePartName, filePart);

        HttpPost request = new HttpPost(settingsService.getContentServerUrl());
        request.setEntity(entity);
        request.setParams(getUploadParams());

        headers.addTo(request);
        headers.getLLCookie().addLLCookieToRequest(httpClient, request);

        try {
            HttpResponse httpResponse = httpClient.execute(request);

            if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
                // workaround for TEMPO-2311: cs.dll returns a 500 on zero-byte uploads instead of
                // ok=false, so we generate a more appropriate response here
                EntityUtils.consume(httpResponse.getEntity());
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            } else {
                duplicateResponse(response, httpResponse);
            }

        } catch (IOException e) {
            request.abort();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Use for file uploads. Streams the content in the input stream, assumed to be multipart form data, to
     * the server, streaming back the response directly.
     *
     * @param url              the URL to POST to
     * @param requestToForward the incoming request
     * @param response         the response to write results to
     * @throws IOException
     */
    public void forwardPostRequest(String url, HttpServletRequest requestToForward, HttpServletResponse response)
            throws IOException {

        // create an entity that simply duplicates the data sent by the client
        // we set chunked to false to be safe: Content Server does not handle chunked requests
        InputStreamEntity entity = new InputStreamEntity(requestToForward.getInputStream(), requestToForward.getContentLength());
        entity.setChunked(false);
        entity.setContentType(requestToForward.getContentType());
        DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);
        HttpPost request = new HttpPost(url);
        request.setEntity(entity);
        request.setParams(getUploadParams());

        // for SEA compatibility, we must include the llcookie
        addForwardHeaders(request, httpClient, requestToForward);

        if (ServletUtil.getCookie(requestToForward, ContentServiceConstants.CS_COOKIE_NAME) != null){
            try {
                HttpResponse httpResponse = httpClient.execute(request);

                if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_INTERNAL_SERVER_ERROR) {
                    EntityUtils.consume(httpResponse.getEntity());
                    // workaround for TEMPO-2311: cs.dll returns a 500 on zero-byte uploads instead of
                    // ok=false, so we generate a more appropriate response here
                    ServletUtil.write(response, ZERO_BYTE_ERROR_RESPONSE);
                } else {
                    duplicateResponse(response, httpResponse);
                }

            } catch (IOException e) {
                request.abort();

                throw e;
            }
        } else {
            ServletUtil.error(response, MISSING_COOKIE_ERROR, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void duplicateResponse(HttpServletResponse servletResponse, HttpResponse httpResponse) throws IOException {
        // copy the response headers to the servlet response
        HeaderIterator headers = httpResponse.headerIterator();
        while (headers.hasNext()) {
            Header header = headers.nextHeader();
            servletResponse.addHeader(header.getName(), header.getValue());
        }

        // make the response types equal
        servletResponse.setStatus(httpResponse.getStatusLine().getStatusCode());

        // write data directly from the CS response to the servlet response
        // httpclient will take care of buffering and sending the data in small chunks
        HttpEntity entity = httpResponse.getEntity();
        if (entity != null) {
            entity.writeTo(servletResponse.getOutputStream());
        }
    }

    private String completeRequest(HttpUriRequest request, HttpServletRequest incoming) throws IOException{
        String jsonString;
        DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);

        addForwardHeaders(request, httpClient, incoming);

        try {
            HttpResponse response = httpClient.execute(request);
            jsonString = EntityUtils.toString(response.getEntity());
        } catch (IOException e) {
            request.abort();
            throw e;
        }

        return jsonString;
    }

    public ResponseWithStatus post(String serverUrl, Map<String, String> parameters, CSForwardHeaders headers) throws IOException {
        ResponseWithStatus result = new ResponseWithStatus();
        DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);
        result.response = "";
        result.status = null;

        HttpPost request = new HttpPost(serverUrl);
        request.setParams(getFrontChannelParams());

        // set headers for Content Server validation
        if (headers != null) {
            headers.addTo(request);
            headers.getLLCookie().addLLCookieToRequest(httpClient, request);
        }

        // prepare the post arguments as an http entity
        UrlEncodedFormEntity entity = encodeParameters(parameters);
        request.setEntity(entity);

        try {
            HttpResponse response = httpClient.execute(request);
            result.status = response.getStatusLine();
            result.response = EntityUtils.toString(response.getEntity());

        } catch (IOException e) {
            request.abort();
            throw e;
        }

        return result;
    }

    private UrlEncodedFormEntity encodeParameters(Map<String, String> parameters) throws UnsupportedEncodingException {

        // first read the parameters into a list of NameValuePair, the required
        // input for building an http entity
        List<NameValuePair> httpParams = parameters.entrySet().stream()
                .map(param -> new BasicNameValuePair(param.getKey(), param.getValue()))
                .collect(Collectors.toList());

        // now convert to an entity
        return new UrlEncodedFormEntity(httpParams,
                ContentServiceConstants.CHAR_ENCODING);
    }

    private HttpParams getUploadParams() {
        return ConnectionProfileManager.getUploadParams();
    }

    private HttpParams getFrontChannelParams() {
        return ConnectionProfileManager.getFrontChannelParams();
    }

    private void addForwardHeaders(HttpUriRequest request, DefaultHttpClient httpClient, HttpServletRequest incoming){

        // Set headers and cookies for Content Server validation
        CSForwardHeaders headers = new CSForwardHeaders(incoming);
        headers.addTo(request);
        headers.getLLCookie().addLLCookieToRequest(httpClient, request);
    }

}
