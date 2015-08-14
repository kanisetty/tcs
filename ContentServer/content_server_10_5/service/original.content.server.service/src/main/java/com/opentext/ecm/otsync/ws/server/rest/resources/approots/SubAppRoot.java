package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

public class SubAppRoot extends ResourcePath {
	@Override
	protected String getPath() {
		return "subapproots";
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String appRoot = AppRoot.getNodeID(pathParams);
		
		createAppRoot(appRoot, req, resp);	
	}

    @Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String appRoot = AppRoot.getNodeID(pathParams);

		getSubAppRoots(appRoot, req, resp);
	}

    private void getSubAppRoots(String appRoot, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.GET_SUB_APP_ROOTS_FUNC, req, resp)
                .param("appRoot", appRoot)
                .executeWithResponse();
    }

    private void createAppRoot(String appRoot, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.CREATE_APP_ROOT_FUNC, req, resp)
		.param("appRoot", appRoot)
		.executeWithResponse();
	}

}
