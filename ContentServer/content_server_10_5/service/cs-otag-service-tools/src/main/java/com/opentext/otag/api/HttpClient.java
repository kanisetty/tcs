package com.opentext.otag.api;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpCookie;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.Cookie;

import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.StatusLine;
import org.apache.http.client.CookieStore;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.params.ClientPNames;
import org.apache.http.client.params.HttpClientParams;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;

public class HttpClient {
	private static final int DEFAULT_DOWNLOAD_TIMEOUT = 3600000;
	private static final int DEFAULT_UPLOAD_TIMEOUT = 1200000;
	private static final int DEFAULT_CONNECTION_TIMEOUT = 15000;
	private static final int DEFAULT_REQUEST_TIMEOUT = 120000;
	private static final int MAX_CONNECTIONS_DEFAULT = 500;
	public static final String ENCODING = "UTF-8";

	public static final Log log = LogFactory.getLog(HttpClient.class);
	
	private final DefaultHttpClient client;
	private final HttpParams downloadParams;
	private final HttpParams uploadParams;
	private final HttpParams frontChannelParams;
	
	private static final int TEMP_COOKIE_LIFETIME = 60 * 1000; // in ms	
	
	protected static final String CS_COOKIE_NAME = "LLCookie";
	private final ThreadSafeClientConnManager connectionManager;
	
	public HttpClient(){
		this(MAX_CONNECTIONS_DEFAULT);
	}
	public HttpClient(int maxConnections){	
		connectionManager = new ThreadSafeClientConnManager();
		connectionManager.setDefaultMaxPerRoute(maxConnections);
		connectionManager.setMaxTotal(maxConnections);
		
		downloadParams = new BasicHttpParams();
		uploadParams = new BasicHttpParams();
		frontChannelParams = new BasicHttpParams();
		
		/**
		 * Downloads: long socket timeout times, as the data may take a long time for the server to prepare. No
		 *   redirecting, as we don't want to serve up a login or error page from Content Server.
		 * Uploads: configurable, moderately-long timeout as the server may take a while to process the uploaded data.
		 * Front-channel: shorter socket timeout, as there is no point in waiting longer than the
		 *   request is active.
		 * Connection timeout in all cases is shorter, as the server is either down or busy if it takes
		 *   long at all to get a connection.
		 */
		HttpClientParams.setRedirecting(downloadParams, false);
		HttpConnectionParams.setConnectionTimeout(downloadParams, DEFAULT_CONNECTION_TIMEOUT);
		HttpConnectionParams.setSoTimeout(downloadParams, DEFAULT_DOWNLOAD_TIMEOUT);

		HttpConnectionParams.setConnectionTimeout(uploadParams, DEFAULT_CONNECTION_TIMEOUT);
		HttpConnectionParams.setSoTimeout(uploadParams, DEFAULT_UPLOAD_TIMEOUT);

		HttpConnectionParams.setConnectionTimeout(frontChannelParams, DEFAULT_CONNECTION_TIMEOUT);
		HttpConnectionParams.setSoTimeout(frontChannelParams, DEFAULT_REQUEST_TIMEOUT);
		
		client = new DefaultHttpClient(connectionManager, frontChannelParams);
		client.getParams().setBooleanParameter(ClientPNames.HANDLE_AUTHENTICATION, false);
	}
	
	public void stop(){
		connectionManager.shutdown();
	}
	
	public String get(String url, List<NameValuePair> params) throws IOException{
		return get(url, params, null);
	}
	public String get(String url, List<NameValuePair> params, HttpContext context) throws IOException{
		String uri = getURI(url, params);		
		HttpGet req = new HttpGet(uri);		
		return execute(req, context);
	}
	
	public String put(String url, List<NameValuePair> params) throws IOException{
		return put(url, params, null);
	}
	public String put(String url, List<NameValuePair> params, HttpContext context) throws IOException{
		String uri = getURI(url, params);		
		HttpPut req = new HttpPut(uri);	
		return execute(req, context);
	}
	
	public String delete(String url, List<NameValuePair> params) throws IOException{
		return delete(url, params, null);
	}
	public String delete(String url, List<NameValuePair> params, HttpContext context) throws IOException{
		String uri = getURI(url, params);		
		HttpDelete req = new HttpDelete(uri);	
		return execute(req, context);
	}
	
	public String post(String url, List<NameValuePair> params, ForwardHeaders headers) throws IOException{
		return post(url, params, headers, null);
	}
	public String post(String url, List<NameValuePair> params, ForwardHeaders headers, HttpContext context) throws IOException{
		HttpPost req = getPostRequest(url, params);	
		headers.addTo(req);
		return execute(req, context);
	}
	
	public void clearCookies(){
		client.getCookieStore().clear();
	}
	
	public static class DetailedResponse{
		public String body;
		public StatusLine status;
		public Header[] cookies;
		public String location = null;
		
		public List<Cookie> getServletCookies(){
			List<Cookie> servletCookies = new ArrayList<Cookie>(cookies.length);

			for(Header cookie : cookies){
				List<HttpCookie> httpCookies = HttpCookie.parse(cookie.getValue());
				for(HttpCookie httpCookie : httpCookies){
					Cookie servletCookie = new Cookie(httpCookie.getName(), httpCookie.getValue());
					servletCookie.setComment(httpCookie.getComment());
					servletCookie.setDomain(httpCookie.getDomain());
					servletCookie.setMaxAge((int)httpCookie.getMaxAge());
					servletCookie.setPath(httpCookie.getPath());
					servletCookie.setSecure(httpCookie.getSecure());
					servletCookie.setVersion(httpCookie.getVersion());
					servletCookie.setHttpOnly(httpCookie.isHttpOnly());
					servletCookies.add(servletCookie);
				}
			}

			return servletCookies;
		}
	}
	public DetailedResponse detailedPost(String url, List<NameValuePair> params, ForwardHeaders headers) throws IOException{
		return detailedPost(url, params, headers, null);
	}
	public DetailedResponse detailedPost(String url, List<NameValuePair> params, ForwardHeaders headers, HttpContext context) throws IOException{
		HttpPost req = getPostRequest(url, params);
		headers.addTo(req);
		return executeRequestWithDetails(req, context);
	}
	
	public HttpPost getPostRequest(String url, List<NameValuePair> params) throws UnsupportedEncodingException {
		UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params, ENCODING);		
		HttpPost req = new HttpPost(url);
		req.setEntity(entity);
		return req;
	}
	
	/**
	 * Use for file uploads. Creates a multipart post with the given parameters followed
	 * by the given input stream as the file content.
	 * @throws IOException 
	 * @param stream stream of file content, ideally streamed in from the request
	 * @param params map of keys and values to send
	 * @param filePartName key for file part (e.g. versionFile)
	 * @param filename name of file being uploaded
	 * @param filesize size of file part
	 * @throws IOException
	 */
	public HttpPost getMultipartPostRequest(
			String url,
			InputStream stream, 
			List<NameValuePair> params,
			String filePartName,
			String filename,
			long filesize) throws IOException{

		ContentBody filePart = new FixedInputStreamBody(stream, filename, filesize);

		MultipartEntity entity = new MultipartEntity();

		for(NameValuePair param : params){
			entity.addPart(param.getName(), new StringBody(param.getValue()));
		}

		entity.addPart(filePartName, filePart);

		HttpPost request = new HttpPost(url);
		request.setEntity(entity);
		request.setParams(uploadParams);
		
		return request;
	}

	public String getURI(String url, List<NameValuePair> params)
			throws UnsupportedEncodingException {
		StringBuilder uriBuilder = new StringBuilder(url);
		char join = '?';
		for(NameValuePair param : params){
			uriBuilder.append(join)
				.append(URLEncoder.encode(param.getName(), ENCODING))
				.append('=')
				.append(URLEncoder.encode(param.getValue(), ENCODING));
			join = '&';
		}
		String uri = uriBuilder.toString();
		return uri;
	}
	
	public HttpContext getContextWithCookie(String cookieName, String value, String url) throws MalformedURLException {
		HttpContext httpContext = new BasicHttpContext();
		if(cookieName != null){
			CookieStore cookieStore = new BasicCookieStore();
			httpContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);

			// set the user's cookie
			BasicClientCookie cookie = new BasicClientCookie(cookieName, value);
			cookie.setVersion(0);
			cookie.setDomain(new URL(url).getHost());
			cookie.setPath("/");
			cookie.setExpiryDate(getCookieExpiryTime());
			cookieStore.addCookie(cookie);
		}
		return httpContext;
	}

	public String execute(HttpUriRequest req, HttpContext context) throws ParseException, IOException {
		try{		
			HttpResponse resp = (context == null) ? client.execute(req) : client.execute(req, context);
			return handleResponse(resp);			
		} catch (IOException e) {
			req.abort();
			throw e;
		}
	}
	
	public DetailedResponse executeRequestWithDetails(HttpUriRequest req, HttpContext context) throws IOException {
		DetailedResponse ret = new DetailedResponse();
		try {
			HttpResponse resp = (context == null) ? client.execute(req) : client.execute(req, context);
			ret.status = resp.getStatusLine();
			final int statusCode = ret.status.getStatusCode();
			if(statusCode == HttpStatus.SC_MOVED_TEMPORARILY || statusCode == HttpStatus.SC_MOVED_PERMANENTLY){
				final Header[] locationHeaders = resp.getHeaders("Location");
				if(locationHeaders != null && locationHeaders.length > 0){
					ret.location = locationHeaders[0].getValue();
				}
			}
			ret.cookies = resp.getHeaders("Set-Cookie");
			ret.body = EntityUtils.toString(resp.getEntity());
		} catch (IOException e){
			req.abort();
			throw e;
		}
		
		return ret;
	}
	
	public HttpResponse executeRaw(HttpUriRequest req, HttpContext context) throws IOException {
		try {
			return (context == null) ? client.execute(req) : client.execute(req, context);
		} catch (IOException e){
			req.abort();
			throw e;
		}
	}

	private static Date getCookieExpiryTime() {
		Date expiryDate = new Date();
		expiryDate.setTime(expiryDate.getTime() + TEMP_COOKIE_LIFETIME);
		return expiryDate;
	}

	private String handleResponse(HttpResponse resp) throws IOException,
			ParseException {
		if(resp.getStatusLine().getStatusCode() != HttpStatus.SC_OK){
			throw new IOException("HTTP error: " + resp.getStatusLine().toString());
		}
		else {
			return EntityUtils.toString(resp.getEntity());
		}
	}
}
