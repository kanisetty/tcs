package com.opentext.ecm.otsync.http;

import java.io.InputStream;

import org.apache.http.entity.mime.content.InputStreamBody;

public class FixedInputStreamBody extends InputStreamBody {
	private long length;

	public FixedInputStreamBody(InputStream in, String filename, long length) {
		super(in, filename);
		this.length = length;
	}

	// TODO FIXME use of deprecated ctor, COntentType is favoured over a raw String by the look of things
	public FixedInputStreamBody(InputStream in, String mimeType, String filename, long length) {
		super(in, mimeType, filename);
		this.length = length;
	}
	
	@Override
	public long getContentLength() {
		return length;
	}
}
