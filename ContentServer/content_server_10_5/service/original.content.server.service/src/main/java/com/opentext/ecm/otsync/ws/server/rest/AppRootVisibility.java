package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootVisibility extends ResourcePath {

    @Override
    protected String getPath() {
        return "visibility";
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String appRoot  = getAppRoot(pathParams);
        changeAppRootVisibility(req, resp, appRoot);
    }

    private String getAppRoot(String[] pathParams) {
        return AppRoot.getNodeID(pathParams);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String appRoot  = getAppRoot(pathParams);
        getAppRootVisibility(req, resp, appRoot);
    }

    private void getAppRootVisibility(HttpServletRequest req, HttpServletResponse resp, String appRoot) {
        new AdminAPI(Message.GET_APP_ROOT_VISIBILITY_FUNC,req,resp)
                .param("id", appRoot)
                .executeWithResponse();
    }

    private void changeAppRootVisibility(HttpServletRequest req, HttpServletResponse resp, String appRoot) {
        new AdminAPI(Message.CHANGE_APP_ROOT_VISIBILITY_FUNC,req,resp)
                .param("id", appRoot)
                .executeWithResponse();
    }
}
