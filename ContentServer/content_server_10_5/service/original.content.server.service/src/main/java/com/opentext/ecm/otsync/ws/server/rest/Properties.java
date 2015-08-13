package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Properties extends ResourcePath {
	@Override
	protected String getPath() {
		return "properties";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {		
		getSettings(req, resp);
	}

	private void getSettings(HttpServletRequest req, HttpServletResponse resp) {
				
	    new AdminAPI(Message.GET_PROPERTIES_FUNC, req, resp)
	    .executeWithResponse();
	}

}
