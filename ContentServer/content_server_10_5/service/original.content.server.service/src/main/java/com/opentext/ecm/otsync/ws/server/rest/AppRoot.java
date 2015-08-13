package com.opentext.ecm.otsync.ws.server.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;

public class AppRoot extends ResourcePath {
	public AppRoot() {
		this.addSubPath(new AppRootSystemShares());
		this.addSubPath(new SubAppRoot());
		this.addSubPath(new AppRootVirtualChildren());
        this.addSubPath(new AppRootVisibility());
        this.addSubPath(new AppRootUsers());
	}
	
	private static final int NODE_ID_PATH_INDEX = 1;

	public static String getNodeID(String[] pathParams) {
		return pathParams[NODE_ID_PATH_INDEX];
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String name = getNodeID(pathParams);
		getIDByName(name, req, resp);
	}

	private void getIDByName(String name, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.GET_APP_ROOT_NODE_ID_FUNC, req, resp)
		.param("name", name)
		.executeWithResponse();
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		updateAppRoot(node, req, resp);
	}

    private void updateAppRoot(String node, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.CHANGE_APP_ROOT_FUNC, req, resp)
		.param("nodeID", node)
		.executeWithResponse();
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		deleteNode(node, req, resp);
	}

	private void deleteNode(String node, HttpServletRequest req,
                            HttpServletResponse resp) {
		new AdminAPI(Message.DELETE_APP_ROOT_FUNC, req, resp)
		.param("nodeID", node)
		.executeWithResponse();
	}
}
