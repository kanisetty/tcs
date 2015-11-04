package com.opentext.otsync.content.ws.server.rest.resources.node;

import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otsync.content.message.Message;

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
