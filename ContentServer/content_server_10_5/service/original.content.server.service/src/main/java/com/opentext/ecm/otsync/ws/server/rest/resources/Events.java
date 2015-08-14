package com.opentext.ecm.otsync.ws.server.rest.resources;

import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.rest.resources.approots.AdminAPI;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Events extends ResourcePath {
	@Override
	protected String getPath() {
		return "events";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String since = req.getParameter("since");
		if(since != null){
			new AdminAPI("otag.watchEventsGet", req, resp)
			.param("since", since)
			.executeWithResponse();
		}
		else {
			rejectRequest(resp);
		}
	}
}
