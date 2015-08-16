package com.opentext.otag.rest.util;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import javax.ws.rs.core.MediaType;

class JsonpResponseWrapper extends HttpServletResponseWrapper {

	private static final String PRE_PADDING = "(";
	private static final String POST_PADDING = ")";
	private static final String JAVASCRIPT_CONTENT_TYPE = "application/x-javascript";
	private final ByteArrayServletOutputStream out = new ByteArrayServletOutputStream();
	private final HttpServletResponse wrapped;
	private final String callback;

	public JsonpResponseWrapper(HttpServletResponse response, String callback) {
		super(response);
		this.wrapped = response;
		this.callback = callback;
	}

	@Override
	public ServletOutputStream getOutputStream() throws IOException {
		return out;
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		return new PrintWriter(new OutputStreamWriter(getOutputStream(), this.getCharacterEncoding()));
	}

	@Override
	public String getContentType() {
		String wrappedContentType = super.getContentType();
		if(MediaType.APPLICATION_JSON.equals(wrappedContentType)){
			return JAVASCRIPT_CONTENT_TYPE;
		}
		else {
			return wrappedContentType;
		}
	}

	void complete() throws IOException {
		String contentType = getContentType();
		OutputStream realOut = wrapped.getOutputStream();
		try {

			if(JAVASCRIPT_CONTENT_TYPE.equals(contentType)){
				wrapped.setContentType(contentType);

				String pre = callback + PRE_PADDING;
				realOut.write(pre.getBytes(getCharacterEncoding()));
				realOut.write(out.getBytes());
				realOut.write(POST_PADDING.getBytes(getCharacterEncoding()));
			}
			else {
				realOut.write(out.getBytes());
			}
		} finally {
			realOut.close();
		}
	}

}
