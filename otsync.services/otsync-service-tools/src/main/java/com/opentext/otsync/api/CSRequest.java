package com.opentext.otsync.api;

import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.core.StreamingOutput;
import java.io.IOException;
import java.io.OutputStream;
import java.net.SocketTimeoutException;
import java.util.List;

import static com.opentext.otsync.api.CSRequestHelper.makeRequest;

/**
 * To return a JSON response directly from an OTAG-style request handler in content server,
 * declare your jax-rs method to return StreamingOutput and return an instance of this
 * class.
 * <p>
 * The oscript-side request handler should return a complete response including headers, generally as JSON,
 * and should handle errors using HTTP status codes; if a response other than 200 is received,
 * this class' write method will throw a corresponding WebApplicationException which will be handled by jax-rs.
 */
public class CSRequest implements StreamingOutput {

    public static final Log log = LogFactory.getLog(CSRequest.class);

    public static final String FUNC_PARAM_NAME = "func";

    protected final String csUrl;
    protected final List<NameValuePair> params;
    protected final CSForwardHeaders headers;

    public CSRequest(String csUrl,
                     String func,
                     List<NameValuePair> params,
                     CSForwardHeaders headers) {
        this.csUrl = csUrl;

        params.add(new BasicNameValuePair(FUNC_PARAM_NAME, func));
        this.params = params;

        this.headers = headers;
    }

    @Override
    public void write(OutputStream out) throws IOException, WebApplicationException {
        HttpPost request = null;

        try {
            request = new HttpPost(csUrl);
            request.setEntity(new UrlEncodedFormEntity(params));
            headers.addTo(request);

            CloseableHttpClient httpClient = HttpClientService.getService().getHttpClient();
            try (CloseableHttpResponse response = makeRequest(httpClient, request, headers)) {
                StatusLine status = response.getStatusLine();
                processResponse(out, response, status);
            }
        } catch (SocketTimeoutException e) {
            log.error("The Content Server request timed out for URL - " + csUrl, e);
            request.abort();
            throw e;
        } catch (IOException e) {
            log.error("Error contacting Content Server", e);
            request.abort();
            throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
        }
    }

    protected void processResponse(OutputStream out,
                                   CloseableHttpResponse response,
                                   final StatusLine status) throws IOException {
        HttpEntity responseEntity = response.getEntity();
        if (responseEntity != null && status.getStatusCode() == HttpStatus.SC_OK) {
            responseEntity.writeTo(out);
            out.close();
        } else {
            throw new WebApplicationException(Response.status(new StatusType() {

                @Override
                public int getStatusCode() {
                    return status.getStatusCode();
                }

                @Override
                public String getReasonPhrase() {
                    return status.getReasonPhrase();
                }

                @Override
                public Family getFamily() {
                    return Family.CLIENT_ERROR;
                }
            }).build());
        }

    }

}
