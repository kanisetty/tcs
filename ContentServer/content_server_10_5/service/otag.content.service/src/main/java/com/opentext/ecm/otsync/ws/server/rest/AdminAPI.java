package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class AdminAPI {

    private final HttpServletResponse resp;
    private final CSForwardHeaders headers;
    private final Map<String, String> params;

    public AdminAPI(String func, HttpServletRequest req, HttpServletResponse resp) {
        this.resp = resp;
        this.headers = new CSForwardHeaders(req);

        this.params = new HashMap<>();
        sendAllParams(req, params);
        params.put("func", func);
    }

    public AdminAPI param(String key, String value) {
        params.put(key, value);
        return this;
    }

    public boolean executeWithResponse() {
        return ResourcePath.doAdminApiPost(resp, headers, params, true);
    }

    public boolean executeWithoutResponse() {
        return ResourcePath.doAdminApiPost(resp, headers, params, false);
    }

    private void sendAllParams(HttpServletRequest req, Map<String, String> params) {
        Enumeration<String> reqParams = req.getParameterNames();
        while (reqParams.hasMoreElements()) {
            String param = reqParams.nextElement();
            params.put(param, req.getParameter(param));
        }
    }
}
