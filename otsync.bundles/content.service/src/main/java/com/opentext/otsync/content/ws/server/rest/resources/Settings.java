package com.opentext.otsync.content.ws.server.rest.resources;

import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class Settings extends ResourcePath {

    @Override
    protected String getPath() {
        return "settings";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {

        Map<String, String> params = new HashMap<>();
        params.put("func", "otsync.settings");

        doAdminApiPost(resp, new CSForwardHeaders(req), params, true); // true: return the response body
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        new AdminAPI("otsync.settings", req, resp).executeWithoutResponse();

    }
}
