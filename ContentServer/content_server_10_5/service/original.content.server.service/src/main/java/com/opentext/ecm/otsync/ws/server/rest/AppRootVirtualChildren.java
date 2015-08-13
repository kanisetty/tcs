package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AppRootVirtualChildren extends ResourcePath {

    public AppRootVirtualChildren() {
        this.addSubPath(new AppRootVirtualChildNodeID());
    }

    @Override
    protected String getPath() {
        return "virtualchildren";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String parentNode = getParentNode(pathParams);

        getVirtualChildren(parentNode, req, resp);
    }

    private String getParentNode(String[] pathParams) {
        return pathParams[pathParams.length - 2];
    }

    private void getVirtualChildren(String parentNode, HttpServletRequest req, HttpServletResponse resp) {
        new AdminAPI(Message.GET_VIRTUAL_CHILDREN_FUNC, req, resp)
                .param("id", parentNode)
                .executeWithResponse();
    }
}
