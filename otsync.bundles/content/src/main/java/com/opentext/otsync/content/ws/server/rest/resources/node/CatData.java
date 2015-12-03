package com.opentext.otsync.content.ws.server.rest.resources.node;

import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CatData extends ResourcePath {

    @Override
    protected String getPath() {
        return "catData";
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);
        String attValues = req.getParameter("attributes");

        updateCatAtts(req, resp, node, attValues);
    }

    private void updateCatAtts(HttpServletRequest req, HttpServletResponse resp, String node, String attValues) {

        new AdminAPI(Message.SET_CAT_ATTS_FUNC, req, resp)
                .param("nodeID", node)
                .param("attributes", attValues)
                .executeWithResponse();
    }
}
