package com.opentext.otsync.content.ws.server.rest.resources;

import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Events extends ResourcePath {

    @Override
    protected String getPath() {
        return "events";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String since = req.getParameter("since");
        if (since != null) {
            new AdminAPI("otag.watchEventsGet", req, resp)
                    .param("since", since)
                    .executeWithResponse();
        } else {
            rejectRequest(resp);
        }
    }
}
