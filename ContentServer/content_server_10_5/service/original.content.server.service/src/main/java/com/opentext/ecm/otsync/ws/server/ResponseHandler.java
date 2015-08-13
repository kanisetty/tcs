package com.opentext.ecm.otsync.ws.server;

import java.io.IOException;
import java.util.Map;

public interface ResponseHandler {

	void send(Map<String, Object> responseData) throws IOException;
	
	void error(String msg);

	void close() throws IOException;

}
