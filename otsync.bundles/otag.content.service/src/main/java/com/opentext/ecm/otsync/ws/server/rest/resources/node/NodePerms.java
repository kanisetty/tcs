package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.AdminAPI;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class NodePerms extends ResourcePath {

    @Override
    protected String getPath() {
        return "perms";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        new AdminAPI(Message.APPLY_PERMS_FUNC, req, resp)
                .param("nodeIDs", "{" + req.getParameter("ids") + "}")
                .executeWithResponse();
    }
}
