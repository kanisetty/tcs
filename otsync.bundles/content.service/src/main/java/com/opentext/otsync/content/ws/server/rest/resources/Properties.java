package com.opentext.otsync.content.ws.server.rest.resources;

import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otsync.content.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Properties extends ResourcePath {
    @Override
    protected String getPath() {
        return "properties";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        getSettings(req, resp);
    }

    private void getSettings(HttpServletRequest req, HttpServletResponse resp) {

        new AdminAPI(Message.GET_PROPERTIES_FUNC, req, resp)
                .executeWithResponse();
    }

}
