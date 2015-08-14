package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootSystemShares extends ResourcePath {
	@Override
	protected String getPath() {
		return "systemshares";
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String appRoot = AppRoot.getNodeID(pathParams);
		
		createSystemShare(appRoot, req, resp);	
	}

    @Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String appRoot = AppRoot.getNodeID(pathParams);

		getSystemShare(appRoot, req, resp);
	}

    private void getSystemShare(String appRoot, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.GET_SYSTEM_SHARES_FUNC, req, resp)
                .param("appRoot", appRoot)
                .executeWithResponse();
    }

    private void createSystemShare(String appRoot, HttpServletRequest req, HttpServletResponse resp) {
		new AdminAPI(Message.CREATE_SYSTEM_SHARE_FUNC, req, resp)
		.param("appRoot", appRoot)
		.executeWithResponse();
	}

}
