package com.opentext.otsync.content.ws.server.rest.resources.node;

import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
