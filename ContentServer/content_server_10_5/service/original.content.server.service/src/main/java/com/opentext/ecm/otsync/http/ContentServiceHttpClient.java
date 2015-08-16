package com.opentext.ecm.otsync.http;

import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.ServletUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.*;
import org.apache.http.client.CookieStore;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.params.HttpClientParams;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class ContentServiceHttpClient {

	private static final Log log = LogFactory.getLog(ContentServiceHttpClient.class);

	// TODO FIXME update HTTP client, a lot of deprecated stuff in here
	private static final int TEMP_COOKIE_LIFETIME = 60 * 1000; // in ms
	private static final String MISSING_COOKIE_ERROR = "Missing or invalid Cookie: Failed to extract cookie data from request.";
	private final HttpParams downloadParams;
	private final HttpParams uploadParams;
	private final HttpParams frontChannelParams;
	protected static final String CS_COOKIE_NAME = "LLCookie";
	private static final ThreadSafeClientConnManager connectionManager = new ThreadSafeClientConnManager();
	private static final DefaultHttpClient httpClient = new DefaultHttpClient(connectionManager);

    // TODO FIXME after the deprecation is sorted work these into the mix
	// we are interested in a number of Settings in this service

//	@SuppressWarnings("unused")
//	public class ConnTimeoutHandler extends AbstractSettingChangeHandler {
//		@Override
//		public String getSettingKey() {
//			return ServletConfig.CS_CONNECTION_TIMEOUT;
//		}
//
//		@Override
//		public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
//            log.info("Updating upstream http connection timeout");
//			setConnectionTimeoutParams();
//		}
//	}
//	@SuppressWarnings("unused")
//	public class ReqTimeoutHandler extends AbstractSettingChangeHandler {
//		@Override
//		public String getSettingKey() {
//			return ServletConfig.REQUEST_TIMEOUT;
//		}
//
//		@Override
//		public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
//			log.info("Updating upstream http request timeout");
//			setRequestTimeoutParams();
//		}
//	}
//	@SuppressWarnings("unused")
//	public class UploadTimeoutHandler extends AbstractSettingChangeHandler {
//		@Override
//		public String getSettingKey() {
//			return ServletConfig.UPLOAD_SOCKET_TIMEOUT;
//		}
//
//		@Override
//		public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
//			log.info("Updating upstream http upload socket timeout");
//			setUploadTimeoutParams();
//		}
//	}
//	@SuppressWarnings("unused")
//	public class ConnectionMaxHandler extends  AbstractSettingChangeHandler {
//		@Override
//		public String getSettingKey() {
//			return ServletConfig.CS_CONNECTIONS_MAX;
//		}
//
//		@Override
//		public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
//			log.info("Updating upstream http connection pool size.");
//			setConnectionPool();
//		}
//	}

	public ContentServiceHttpClient(){
		setConnectionPool();
		
		downloadParams = new BasicHttpParams();
		uploadParams = new BasicHttpParams();
		frontChannelParams = new BasicHttpParams();
		
		/**
		 * Downloads:
		 * long socket timeout times, as the data may take a long time for the server to prepare. No
		 *   redirecting, as we don't want to serve up a login or error page from Content Server.
		 *
		 * Uploads:
		 *  configurable, moderately-long timeout as the server may take a while to process the uploaded data.
		 *
		 * Front-channel:
		 * shorter socket timeout, as there is no point in waiting longer than the
		 *   request is active.
		 *
		 * Connection timeout in all cases is shorter, as the server is either down or busy if it takes
		 *   long at all to get a connection.
		 */
		HttpClientParams.setRedirecting(downloadParams, false);		
		setConnectionTimeoutParams();
		setUploadTimeoutParams();
		setRequestTimeoutParams();
	}

	private void setConnectionPool() {
		connectionManager.setDefaultMaxPerRoute(ServletConfig.getCSConnectionPoolSize()); 
		connectionManager.setMaxTotal(ServletConfig.getCSConnectionPoolSize());
	}
	
	private void setConnectionTimeoutParams() {
		int connectionTimeout = ServletConfig.getConnectionTimeout();
		HttpConnectionParams.setConnectionTimeout(downloadParams, connectionTimeout);
		HttpConnectionParams.setConnectionTimeout(uploadParams, connectionTimeout);
		HttpConnectionParams.setConnectionTimeout(frontChannelParams, connectionTimeout);
	}

	private void setRequestTimeoutParams() {
		HttpConnectionParams.setSoTimeout(downloadParams, ServletConfig.getServlet3ContentTimeout());
		HttpConnectionParams.setSoTimeout(frontChannelParams, ServletConfig.getServlet3RequestTimeout());
	}

	private void setUploadTimeoutParams() {
		HttpConnectionParams.setSoTimeout(uploadParams, ServletConfig.getUploadSocketTimeout());
	}

	/**
	 * Sends an HTTP POST request to a url, with the given parameters, as though they
	 * were the contents of an HTML form
	 * 
	 * @param serverUrl - The URL of the server
	 * @param parameters - a map of parameters; they keys are the names of the arguments
	 * @throws IOException 
	 * 
	 */
	public String postData(String serverUrl, Map<String, String> parameters) throws IOException{
		return postData(serverUrl, parameters, null);
	}
	public String postData(String serverUrl, Map<String, String> parameters, RequestHeader headers) throws IOException {

		// prepare the post arguments as an http entity
		UrlEncodedFormEntity entity = encodeParameters(parameters);
		HttpPost httpPost = new HttpPost(serverUrl);
		httpPost.setEntity(entity);
		httpPost.setParams(frontChannelParams);

		// set headers for Content Server validation
		if(headers != null){
			headers.addTo(httpPost);
		}

		// send the request and get the response
		String result = completeRequest(httpPost);

		return result;
	}

	public void streamGetResponse(String url, HttpServletResponse servletResponse) throws IOException{
		throw new UnsupportedOperationException("Downloads are only allowed with cookies at present.");
	}

	public String storeGetResponse(String url, HttpServletResponse servletResponse, String filename) throws IOException{
		throw new UnsupportedOperationException("Downloads are only allowed with cookies at present.");
	}

	/**
	 * Use for file downloads. Sets the given cookie, just for this request (other threads should be unaffected),
	 * and streams the results of the GET request directly back via the servlet response.
	 * @param url The exact URL to download, including any parameters
	 * @param servletResponse
	 * @param cookieName
	 * @param value
	 * @throws IOException
	 */
	public void streamGetResponseWithUserCookie(String url, HttpServletResponse servletResponse, String cookieName,	String value, RequestHeader headers) throws IOException {
		HttpRequestPair requestPair = getResponseWithUserCookie(url, cookieName, value, headers);
		try{
			duplicateResponse(servletResponse, requestPair.response);
			
		} catch (IOException e){
			requestPair.request.abort();
			throw e;
		}
	}
	
	/**
	 * Use for chunked file downloads. Sets the given cookie, just for this request (other threads should be unaffected),
	 * and stores the results of the GET request directly to the tempfiles directory. Also, the response headers will be set
	 * so the file name is properly set.
	 * @param url The exact URL to download, including any parameters
	 * @param servletResponse
	 * @param cookieName
	 * @param value
	 * @return String
	 * @throws IOException
	 */
	public String storeGetResponseWithUserCookie(String url, HttpServletResponse servletResponse, String cookieName, String value, String filename, RequestHeader headers) throws IOException {
		HttpRequestPair requestPair = getResponseWithUserCookie(url, cookieName, value, headers);
		try{
			return stripHeadersAndReturnFilename(servletResponse, filename, requestPair.response);
			
		} catch (IOException e){
			requestPair.request.abort();
			throw e;
		}
	}

	//strips out the content-length and filename headers, which are properly added as part of the chunked download logic
	private String stripHeadersAndReturnFilename(HttpServletResponse servletResponse, String filename, HttpResponse httpResponse) throws IOException {
		HeaderIterator headers = httpResponse.headerIterator();
		String ret = "";
		
		while(headers.hasNext()){
			Header header = headers.nextHeader();
			if (!"content-length".equalsIgnoreCase(header.getName())) {
				if ("content-disposition".equalsIgnoreCase(header.getName())) {
					int filenameIndex = header.getValue().indexOf("filename=") + 9;
					ret = header.getValue().substring(filenameIndex);
				}
				else {
					servletResponse.addHeader(header.getName(), header.getValue());
				}
			}
		}

		storeResponse(filename, httpResponse);
		return ret;
	}
	
	public HttpRequestPair getResponseWithUserCookie(String url, String cookieName, String value, RequestHeader headers) throws IOException {
		// Create a local context and associated cookie store for this call only, so that
		// a long download can proceed without interfering with other users' cookies
		CookieStore cookieStore = new BasicCookieStore();
		HttpContext httpContext = new BasicHttpContext();
		httpContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);

		// set the user's cookie
		BasicClientCookie cookie = new BasicClientCookie(cookieName, value);
		cookie.setVersion(0);
		cookie.setDomain(getServerHostName());
		cookie.setPath("/");
		cookie.setExpiryDate(getCookieExpiryTime());
		cookieStore.addCookie(cookie);

		// send the request using the local cookie, disallowing redirects
		HttpUriRequest request = new HttpGet(url);
		request.setParams(downloadParams);

		// set headers for Content Server validation
		headers.addTo(request);

		HttpResponse httpResponse = httpClient.execute(request, httpContext);

		return new HttpRequestPair(request, httpResponse);
	}
	
	/**
	 * Use for file uploads assembled in the Engine. Creates and sends a multipart post with the given parameters followed
	 * by the given input stream as the file content. The response is streamed back directly.
	 * @throws IOException 
	 * @param stream stream of file content, ideally streamed in from the request
	 * @param params map of keys and values to send
	 * @param filePartName key for file part (e.g. versionFile)
	 * @param filename name of file being uploaded
	 * @param filesize size of file part (from Part.getSize())
	 * @param headers taken from the the client's request
	 * @param response server response will be written directly to this response
	 * @throws IOException
	 */
	public void forwardMultiPartPost(
			InputStream stream, 
			Map<String, String> params,
			String filePartName,
			String filename,
			long filesize,
			RequestHeader headers, 
			HttpServletResponse response,
			String cstoken) throws IOException{
		
		ContentBody filePart = new FixedInputStreamBody(stream, filename, filesize);
		
		MultipartEntity entity = new MultipartEntity();
		
		for(Map.Entry<String, String> param : params.entrySet()){
			entity.addPart(param.getKey(), new StringBody(param.getValue()));
		}
		
		entity.addPart(filePartName, filePart);
		
		HttpPost request = new HttpPost(ServletConfig.getContentServerUrl());
		request.setEntity(entity);
		request.setParams(uploadParams);
		
		// for SEA compatibility, we must include the llcookie
		
		if(cstoken != null){
            request.addHeader("Cookie", CS_COOKIE_NAME + "=" + cstoken);
            // set headers for Content Server validation
            headers.addTo(request);

            try {
                HttpResponse httpResponse = httpClient.execute(request);
                
                if(httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_INTERNAL_SERVER_ERROR){
                	// workaround for TEMPO-2311: cs.dll returns a 500 on zero-byte uploads instead of
                	// ok=false, so we generate a more appropriate response here
                	EntityUtils.consume(httpResponse.getEntity());
                	response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                }
                else {
                	duplicateResponse(response, httpResponse);
                }

            } catch (IOException e) {
                request.abort();
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
		} else {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
	}
	
	/**
	 * Use for file uploads. Streams the content in the input stream, assumed to be multipart form data, to
	 * the server, streaming back the response directly.
	 * 
	 * @param url the URL to POST to
	 * @param requestToForward the incoming request
	 * @param response the response to write results to
	 * @throws IOException
	 */
	public void forwardPostRequest(String url, HttpServletRequest requestToForward, HttpServletResponse response) 
	throws IOException {
		
		// create an entity that simply duplicates the data sent by the client
		// we set chunked to false to be safe: Content Server does not handle chunked requests
		InputStreamEntity entity = new InputStreamEntity(requestToForward.getInputStream(), requestToForward.getContentLength());
		entity.setChunked(false);
		entity.setContentType(requestToForward.getContentType());
		HttpPost request = new HttpPost(url);
		request.setEntity(entity);
		request.setParams(uploadParams);
		
		// for SEA compatibility, we must include the llcookie
		String llcookie = ServletUtil.getCookie(requestToForward, CS_COOKIE_NAME);
		
		// Check if we got a valid cookie otherwise we respond with an error message.
		if(llcookie != null){
                    request.addHeader("Cookie", CS_COOKIE_NAME + "=" + URLEncoder.encode(llcookie, ServletConfig.CHAR_ENCODING));
                    // set headers for Content Server validation
                    RequestHeader headers = new RequestHeader(requestToForward);
                    headers.addTo(request);

                    try {
                        HttpResponse httpResponse = httpClient.execute(request);
                        
                        if(httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_INTERNAL_SERVER_ERROR){
                        	// workaround for TEMPO-2311: cs.dll returns a 500 on zero-byte uploads instead of
                        	// ok=false, so we generate a more appropriate response here
                        	String zeroByteErrorResponse = 
                        			"{\"auth\"=true,\"ok\"=false,\"errMsg\"=\"Cannot upload zero-byte file.\",\"info\":{\"auth\"=true,\"ok\"=false,\"errMsg\"=\"Cannot upload zero-byte file.\"}}";
                        	EntityUtils.consume(httpResponse.getEntity());
                        	ServletUtil.write(response, zeroByteErrorResponse);
                        }
                        else {
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

	private void duplicateResponse(HttpServletResponse servletResponse, HttpResponse httpResponse)	throws IOException {
		
		// copy the response headers to the servlet response
		HeaderIterator headers = httpResponse.headerIterator();
		while(headers.hasNext()){
			Header header = headers.nextHeader();
			servletResponse.addHeader(header.getName(), header.getValue());
		}
		
		// make the response types equal
		servletResponse.setStatus(httpResponse.getStatusLine().getStatusCode());
		
		// write data directly from the CS response to the servlet response
		// httpclient will take care of buffering and sending the data in small chunks
		HttpEntity entity = httpResponse.getEntity();
		if(entity != null){
			entity.writeTo(servletResponse.getOutputStream());
		}
	}

	private void storeResponse(String filename, HttpResponse httpResponse) throws IOException {
		
		FileOutputStream fos = new FileOutputStream(ServletConfig.getTempfileDir() + filename);
		
		try{
			httpResponse.getEntity().writeTo(fos);
			
		} finally {
			fos.close();
		}
	}

	private String completeRequest(HttpUriRequest request) throws IOException {
		String jsonString = "";
		
		try{
			HttpResponse response = httpClient.execute(request);
			jsonString = EntityUtils.toString(response.getEntity());
		
		} catch (IOException e){
			request.abort();
			throw e;
		}
                
		return jsonString;
	}

	/**
	 * Sends an HTTP POST request to a url, first setting the given cookie, then
	 * removing all cookies once the response has been read.
	 * 
	 * Note that this method is synchronized: only one thread can use it at a
	 * time, so that cookies don't overlap
	 * 
	 * @param serverUrl
	 *            - The URL of the server
	 * @param parameters
	 *            - all the request parameters (Example:
	 *            "param1=val1&param2=val2")
	 * @param cookieName
	 *            The name of the cookie to set for this request only
	 * @param value
	 *            The value of the cookie to set for this request only
	 * @return
	 * @throws IOException 
	 */
	public String postDataWithTemporaryCookie(String serverUrl, Map<String, String> parameters, String cookieName, String value, RequestHeader headers)
	throws IOException {

		synchronized(httpClient){
			setTemporaryCookie(cookieName, value);

			String result = postData(serverUrl, parameters, headers);

			clearTemporaryCookie();

			return result;
		}
	}

	public class ResponseWithStatus{
		public String response;
		public StatusLine status;
	}
	public ResponseWithStatus post(String serverUrl, Map<String, String> parameters, String cookieName, String value, RequestHeader headers)
			throws IOException {
		ResponseWithStatus result = new ResponseWithStatus();
		result.response = "";
		result.status = null;

		HttpPost request = new HttpPost(serverUrl);
		request.setParams(frontChannelParams);
		
		// set headers for Content Server validation
		if(headers != null){
			headers.addTo(request);
		}
		
		// prepare the post arguments as an http entity
		UrlEncodedFormEntity entity = encodeParameters(parameters);
		request.setEntity(entity);

		HttpContext httpContext = getContextWithCookie(cookieName, value);		

		try{
			HttpResponse response = httpClient.execute(request, httpContext);
			result.status = response.getStatusLine();
			result.response = EntityUtils.toString(response.getEntity());

		} catch (IOException e){
			request.abort();
			throw e;
		}

		return result;

	}

	public HttpContext getContextWithCookie(String cookieName, String value)
			throws MalformedURLException {
		HttpContext httpContext = new BasicHttpContext();
		if(cookieName != null){
			CookieStore cookieStore = new BasicCookieStore();
			httpContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);

			// set the user's cookie
			BasicClientCookie cookie = new BasicClientCookie(cookieName, value);
			cookie.setVersion(0);
			cookie.setDomain(getServerHostName());
			cookie.setPath("/");
			cookie.setExpiryDate(getCookieExpiryTime());
			cookieStore.addCookie(cookie);
		}
		return httpContext;
	}

	private void setTemporaryCookie(String cookieName, String value) throws UnsupportedEncodingException {
		try {

			BasicClientCookie cookie = new BasicClientCookie(cookieName, value);
			cookie.setVersion(0);
			cookie.setDomain(getServerHostName());
			cookie.setPath("/");
			cookie.setExpiryDate(getCookieExpiryTime());

			httpClient.getCookieStore().addCookie(cookie);

		} catch (MalformedURLException e) {
			log.error("Could not set cookie; problem parsing server url", e);
		}
	}

	private void clearTemporaryCookie() {
		httpClient.getCookieStore().clear();
	}

	private static Date getCookieExpiryTime() {
		Date expiryDate = new Date();
		expiryDate.setTime(expiryDate.getTime() + TEMP_COOKIE_LIFETIME);
		return expiryDate;
	}

	private static String getServerHostName() throws MalformedURLException {
		return new URL(ServletConfig.getContentServerUrl()).getHost();
	}

	private UrlEncodedFormEntity encodeParameters(Map<String, String> parameters) throws UnsupportedEncodingException {

		// first read the parameters into a list of NameValuePair, the required
		// input for building an http entity
		List<NameValuePair> httpParams = new ArrayList<NameValuePair>();
		for (Entry<String, String> param : parameters.entrySet()) {
			httpParams.add(new BasicNameValuePair(param.getKey(), param
					.getValue()));
		}

		// now convert to an entity
		UrlEncodedFormEntity entity = new UrlEncodedFormEntity(httpParams,
				ServletConfig.CHAR_ENCODING);

		return entity;
	}

	//assumes tempFilename is the filename of a file containing the multipart post data, except the headers
	//realFilename is the actual name of the file stored in the multipart post, and boundary is the boundary
	//string separating each part of the multipart post.
	public void streamMultipartPost(HttpServletResponse servletResponse, String url, String tempFullpath, String realFilename, String boundary, String llcookie, RequestHeader headers) throws IOException {
		File file = new File(tempFullpath);
		FileInputStream in = new FileInputStream(tempFullpath);
		HttpPost httpPost = null;
		
		try{
			InputStreamEntity entity = new InputStreamEntity(in, file.length());
			entity.setContentType("multipart/form-data; boundary=" + boundary);
			entity.setChunked(false);
			entity.setContentEncoding(ServletConfig.CHAR_ENCODING);
			
			httpPost = new HttpPost(url);
			httpPost.setEntity(entity);
			httpPost.setParams(uploadParams);
			
			// for SEA compatibility, we must include the llcookie
			httpPost.addHeader("Cookie", CS_COOKIE_NAME + "=" + llcookie);
	
			// set headers for Content Server validation
			headers.addTo(httpPost);
	
			// send the request and get the response
			HttpResponse response = httpClient.execute(httpPost);
			duplicateResponse(servletResponse, response);
			
		} catch (IOException e){
            httpPost.abort();
			throw e;
			
		} finally {
			in.close();	
		}
	}

	private class HttpRequestPair{
		public HttpRequestPair(HttpUriRequest request, HttpResponse response) {
			this.request = request;
			this.response = response;
		}
		
		public HttpUriRequest request;
		public HttpResponse response;
	}
	
}
