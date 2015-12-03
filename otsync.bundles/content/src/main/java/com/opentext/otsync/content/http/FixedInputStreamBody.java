package com.opentext.otsync.content.http;

import java.io.InputStream;

import org.apache.http.entity.mime.content.InputStreamBody;

public class FixedInputStreamBody extends InputStreamBody {
	private long length;

	public FixedInputStreamBody(InputStream in, String filename, long length) {
		super(in, filename);
		this.length = length;
	}
	
	public FixedInputStreamBody(InputStream in, String mimeType, String filename, long length) {
		super(in, mimeType, filename);
		this.length = length;
	}
	
	@Override
	public long getContentLength() {
		return length;
	}
}
