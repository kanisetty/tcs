package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootVirtualChildNodeID extends ResourcePath {

    private static final int NODE_ID_PATH_INDEX = 3;
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String parentNode = getParentNode(pathParams);
        String virtualChildNode = getVirtualChildNodeID(pathParams);

        addVirtualChild(parentNode, virtualChildNode,req,resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String parentNode = getParentNode(pathParams);
        String virtualChildNode = getVirtualChildNodeID(pathParams);

        removeVirtualChild(parentNode, virtualChildNode, req, resp);
    }

    private void removeVirtualChild(String parentNode, String virtualChildNode, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.DELETE_VIRTUAL_CHILD_FUNC, req, resp)
                .param("id", parentNode)
                .param("virtualChildId", virtualChildNode)
                .executeWithResponse();
    }

    private String getParentNode(String[] pathParams) {
        return AppRoot.getNodeID(pathParams);
    }

    private String getVirtualChildNodeID(String[] pathParams) {
        return pathParams[NODE_ID_PATH_INDEX];
    }

    private void addVirtualChild(String parentNode, String virtualChildNode, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.ADD_VIRTUAL_CHILD_FUNC, req, resp)
                .param("id", parentNode)
                .param("virtualChildId", virtualChildNode)
                .executeWithResponse();
    }
}
