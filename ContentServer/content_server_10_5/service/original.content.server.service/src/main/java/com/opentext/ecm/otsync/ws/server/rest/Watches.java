package com.opentext.ecm.otsync.ws.server.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Watches extends ResourcePath {

	public Watches(){
		this.addSubPath(new WatchID());
	}
	
	@Override
	protected String getPath() {
		return "watches";
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		new AdminAPI("otag.watchesGet", req, resp)
		.executeWithResponse();
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		
		String nodeIDList = req.getParameter("ids");
		
		if(nodeIDList != null){
			new AdminAPI("otag.watchesPut", req, resp)
			.param("nodeIDs", "{" + nodeIDList + "}")
			.executeWithResponse();
		}
		else {
			rejectRequest(resp);
		}
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		
		String nodeIDList = req.getParameter("ids");
		
		if(nodeIDList != null){
			new AdminAPI("otag.watchesDelete", req, resp)
			.param("nodeIDs", "{" + nodeIDList + "}")
			.executeWithResponse();
		}
		else {
			rejectRequest(resp);
		}
	}
}
