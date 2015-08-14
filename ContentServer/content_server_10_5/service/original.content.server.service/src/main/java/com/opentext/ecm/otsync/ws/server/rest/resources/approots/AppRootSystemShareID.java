package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootSystemShareID extends ResourcePath {
    private static final int NODE_ID_INDEX = 2;

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String systemShareNode = getSystemShareNode(pathParams);
        deleteSystemShare(req,resp,systemShareNode);
    }

    private void deleteSystemShare(HttpServletRequest req, HttpServletResponse resp, String systemShareNode) {
        new AdminAPI(Message.DELETE_SYSTEM_SHARE_FUNC,req,resp)
                .param("nodeID", systemShareNode)
                .executeWithResponse();
    }

    private String getSystemShareNode(String[] pathParams) {
        return pathParams[NODE_ID_INDEX];
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String systemShareNode = getSystemShareNode(pathParams);
        changeSystemShare(req, resp, systemShareNode);
    }

    private void changeSystemShare(HttpServletRequest req, HttpServletResponse resp, String systemShareNode) {
        new AdminAPI(Message.CHANGE_SYSTEM_SHARE_FUNC,req,resp)
                .param("nodeID",systemShareNode)
                .executeWithResponse();
    }

}
