package com.opentext.otag.rest.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.ServletOutputStream;

class ByteArrayServletOutputStream extends ServletOutputStream {
	private final ByteArrayOutputStream stream = new ByteArrayOutputStream();

	public void write(int b) throws IOException {
		stream.write(b);
	}

	public void write(byte[] b) throws IOException {
		stream.write(b);
	}
	
	public void write(byte[] b, int off, int len) throws IOException {
		stream.write(b, off, len);
	}
	
	byte[] getBytes(){
		return stream.toByteArray();
	}

}
