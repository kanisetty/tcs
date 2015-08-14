package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

public class AppRootChildren extends ResourcePath {
	
	public AppRootChildren() {
		this.addSubPath(new AppRootChild());
	}
	
	@Override
	protected String getPath() {
		return "children";
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String appRoot = AppRoot.getNodeID(pathParams);
		
		createSystemShare(appRoot, req, resp);	
	}

	private void createSystemShare(String appRoot, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.CREATE_SYSTEM_SHARE_FUNC, req, resp)
		.param("appRoot", appRoot)
		.executeWithResponse();
	}

}
