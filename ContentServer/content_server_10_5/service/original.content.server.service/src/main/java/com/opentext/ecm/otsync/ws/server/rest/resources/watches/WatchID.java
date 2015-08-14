package com.opentext.ecm.otsync.ws.server.rest.resources.watches;

import com.opentext.ecm.otsync.ws.server.rest.resources.approots.AdminAPI;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class WatchID extends ResourcePath {
	private static final int WATCH_ID_PATH_INDEX = 1;

	public static String getNodeID(String[] pathParams) {
		return pathParams[WATCH_ID_PATH_INDEX];
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		
		new AdminAPI("otag.watchesPut", req, resp)
		.param("nodeIDs", "{" + node + "}")
		.executeWithResponse();
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getNodeID(pathParams);
		
		new AdminAPI("otag.watchesDelete", req, resp)
		.param("nodeIDs", "{" + node + "}")
		.executeWithResponse();
	}
}
