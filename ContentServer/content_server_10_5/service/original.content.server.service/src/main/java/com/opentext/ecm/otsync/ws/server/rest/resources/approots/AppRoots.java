package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRoots extends ResourcePath {
	
	public AppRoots() {
		this.addSubPath(new AppRoot());
		this.addSubPath(new AppRootSystemShare());
	}
	
	@Override
	protected String getPath() {
		return "approots";
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		createAppRoot(req, resp);
	}

	private void createAppRoot(HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.CREATE_APP_ROOT_FUNC, req, resp)
		.executeWithResponse();
	}

}
