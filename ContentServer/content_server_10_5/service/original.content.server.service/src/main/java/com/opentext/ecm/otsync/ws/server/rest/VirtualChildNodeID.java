package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VirtualChildNodeID extends ResourcePath {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String parentNode = getParentNode(pathParams);
        String virtualChildNode = getVirtualChildNodeID(pathParams);

        addVirtualChild(parentNode, virtualChildNode,req,resp);
    }

    private String getParentNode(String[] pathParams) {
        return pathParams[pathParams.length - 3];
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        String parentNode = getParentNode(pathParams);
        String virtualChildNode = getVirtualChildNodeID(pathParams);

        deleteVirtualChild(parentNode, virtualChildNode, req, resp);
    }

    private void deleteVirtualChild(String parentNode, String virtualChildNode, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.DELETE_VIRTUAL_CHILD_FUNC, req, resp)
                .param("id", parentNode)
                .param("virtualChildId", virtualChildNode)
                .executeWithResponse();
    }

    private String getVirtualChildNodeID(String[] pathParams) {
        return pathParams[pathParams.length - 1];
    }

    private void addVirtualChild(String parentNode, String virtualChildNode, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.ADD_VIRTUAL_CHILD_FUNC, req, resp)
                .param("id", parentNode)
                .param("virtualChildId", virtualChildNode)
                .executeWithResponse();
    }
}
