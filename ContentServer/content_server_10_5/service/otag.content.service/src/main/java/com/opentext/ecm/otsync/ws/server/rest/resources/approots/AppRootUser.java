package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.AdminAPI;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootUser extends ResourcePath {
	private static final int USERNAME_PATH_INDEX = 3;

	public static String getUsername(String[] pathParams) {
		return pathParams[USERNAME_PATH_INDEX];
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = AppRoot.getNodeID(pathParams);
		String user = getUsername(pathParams);
		
		addUser(node, user, req, resp);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = AppRoot.getNodeID(pathParams);
		String user = getUsername(pathParams);
		
		removeUser(node, user, req, resp);
	}
	
	private void addUser(String node, String user, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.ADD_APP_ROOT_USER_FUNC, req, resp)
		.param("id", node)
		.param("username", user)
		.executeWithResponse();
	}
	
	private void removeUser(String node, String user, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.REMOVE_APP_ROOT_USER_FUNC, req, resp)
		.param("id", node)
		.param("username", user)
		.executeWithResponse();
	}
}
