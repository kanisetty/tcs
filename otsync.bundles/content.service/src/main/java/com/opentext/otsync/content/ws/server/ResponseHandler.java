package com.opentext.otsync.content.ws.server;

import java.io.IOException;
import java.util.Map;

public interface ResponseHandler {
	public void send(Map<String, Object> responseData) throws IOException;
	
	public void error(String msg);

	public void close() throws IOException;
}
