package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.AdminAPI;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootChild extends ResourcePath {
	private static final int NODE_ID_PATH_INDEX = 3;
	
	public AppRootChild() {
		this.addSubPath(new AppRootUsers());
		this.addSubPath(new AppRootVirtualChildren());
	}

	public static String getNodeID(String[] pathParams) {
		return pathParams[NODE_ID_PATH_INDEX];
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		
		updateSystemShare(node, req, resp);
	}

	private void updateSystemShare(String node, HttpServletRequest req,	HttpServletResponse resp) {
		new AdminAPI(Message.CHANGE_SYSTEM_SHARE_FUNC, req, resp)
		.param("nodeID", node)
		.executeWithResponse();
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		
		deleteSystemShare(node, req, resp);
	}

	private void deleteSystemShare(String node, HttpServletRequest req,	HttpServletResponse resp) {
		new AdminAPI(Message.DELETE_SYSTEM_SHARE_FUNC, req, resp)
		.param("nodeID", node)
		.executeWithResponse();
	}
}
