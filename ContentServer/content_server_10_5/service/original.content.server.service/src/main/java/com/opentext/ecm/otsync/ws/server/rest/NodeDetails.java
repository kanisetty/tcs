package com.opentext.ecm.otsync.ws.server.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;

public class NodeDetails extends ResourcePath {
	@Override
	protected String getPath() {
		return "details";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = NodeID.getNodeID(pathParams);
		
		getNodeDetails(req, resp, node);
	}

	private void getNodeDetails(HttpServletRequest req, HttpServletResponse resp, String node) {
		
	    new AdminAPI(Message.GET_NODE_DETAILS_FUNC, req, resp)
	    .param("nodeID", node)
	    .executeWithResponse();
	}
}
