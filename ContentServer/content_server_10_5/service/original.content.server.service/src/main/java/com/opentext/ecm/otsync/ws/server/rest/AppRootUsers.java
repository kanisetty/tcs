package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootUsers extends ResourcePath {

    public AppRootUsers() {
        this.addSubPath(new AppRootUser());
    }

    @Override
    protected String getPath() {
        return "users";
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String node = AppRoot.getNodeID(pathParams);
        addBulkNodePermission(req, resp, node);
    }

    private void addBulkNodePermission(HttpServletRequest req, HttpServletResponse resp, String node) {
        new AdminAPI(Message.ADD_APP_ROOT_BULK_PERM_FUNC, req, resp)
                .param("id", node)
                .executeWithResponse();
    }

}
