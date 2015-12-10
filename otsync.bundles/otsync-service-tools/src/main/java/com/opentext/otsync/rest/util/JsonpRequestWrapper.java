package com.opentext.otsync.rest.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;

class JsonpRequestWrapper extends HttpServletRequestWrapper{

	private final String method;

	public JsonpRequestWrapper(HttpServletRequest request, String method) {
		super(request);
		this.method = method;
	}
	
	@Override
	public String getMethod() {
		return method;
	}
	
	@Override
	public ServletInputStream getInputStream() throws IOException {
		if(!"POST".equalsIgnoreCase(getMethod())) return super.getInputStream();
		
		// For spoofing a POST request, fake an entity with all the request parameters.
		// This makes _method=POST compatible with jax-rs @FormParam (which reads from the entity)
		return new ServletInputStream() {
			
			private InputStream stream = getEntityStream();
			
			@Override
			public int read() throws IOException {
				return stream.read();
			}
			
			@Override
			public int read(byte[] b) throws IOException {
				return stream.read(b);
			}
			
			@Override
			public int read(byte[] b, int off, int len) throws IOException {
				return stream.read(b, off, len);
			}
		};
	}
	
	@Override
	public BufferedReader getReader() throws IOException {
		if(!"POST".equalsIgnoreCase(getMethod())) return super.getReader();
		
		// For spoofing a POST request, fake an entity with all the request parameters.
		// This makes _method=POST compatible with jax-rs @FormParam (which reads from the entity)
		return new BufferedReader(new InputStreamReader(getEntityStream(), getCharacterEncoding()));
	}

	private InputStream getEntityStream() {		
		try {
			// Get all query params, use HttpClient to build a form-encoded entity from them, and return a stream from that entity
			Map<String, String[]> params = getParameterMap();
			
			List<NameValuePair> paramList = new ArrayList<NameValuePair>();
			for (Entry<String, String[]> param : params.entrySet()) {
				for(String value : param.getValue()){
					paramList.add(new BasicNameValuePair(param.getKey(), value));
				}
			}
			
			UrlEncodedFormEntity entity = new UrlEncodedFormEntity(paramList, getCharacterEncoding());
			return entity.getContent();
			
		} catch (UnsupportedEncodingException e) {
			throw new UnsupportedOperationException("Can't encode wrapped form entity: unknown encoding", e);
		} catch (IOException e) {
			throw new UnsupportedOperationException("Can't create wrapped form content", e);
		}
	}

}
