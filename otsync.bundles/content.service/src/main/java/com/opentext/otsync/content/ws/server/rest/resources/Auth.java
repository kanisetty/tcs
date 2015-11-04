package com.opentext.otsync.content.ws.server.rest.resources;

import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class Auth extends ResourcePath {
    @Override
    protected String getPath() {
        return "auth";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        HashMap<String, Object> payload = Message.makePayload(Message.SERVER_CHECK_KEY_VALUE, null, req);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {

        if (ContentServiceConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter("admin"))) {
            getAdminCookie(req, resp);
        } else {
            authorize(req);
        }
    }

    public void authorize(HttpServletRequest req) {
        HashMap<String, Object> payload = Message.makePayload(Message.AUTH_KEY_VALUE, Message.AUTH_KEY_VALUE, req);
        payload.put(Message.USERNAME_KEY_NAME, req.getParameter("username"));
        payload.put(Message.PASSWORD_KEY_NAME, req.getParameter("password"));
        payload.put(Message.IMPERSONATE_KEY_NAME, Boolean.parseBoolean(req.getParameter("impersonate")));

        //Client tracking info
        payload.put(Message.CLIENT_OS_KEY_NAME, req.getParameter("os"));
        payload.put(Message.CLIENT_VERSION_KEY_NAME, req.getParameter("version"));
        payload.put(Message.CLIENT_BITNESS_KEY_NAME, req.getParameter("bitness"));
        payload.put(Message.CLIENT_LANGUAGE_KEY_NAME, req.getParameter("language"));
        payload.put(Message.CLIENT_OSVERSION_KEY_NAME, req.getParameter("osVersion"));
        payload.put(Message.CLIENT_TYPE_KEY_NAME, req.getParameter("type"));
        payload.put(Message.CLIENT_DEVICE_ID_KEY_NAME, req.getParameter("deviceID"));
        payload.put(Message.CLIENT_LOCATION_KEY_NAME, req.getParameter("location"));
        payload.put(Message.CLIENT_CLOUD_PUSH_KEY_NAME, req.getParameter("cloudPushKey"));

        // enqueue auth requests unless auto=false (desktop clients may make this call all at once on Engine restart)
        boolean enqueue = !"false".equalsIgnoreCase(req.getParameter("auto"));

        getFrontChannel().sendFrontChannelPayload(req, payload, enqueue);
    }

    public void getAdminCookie(HttpServletRequest req, HttpServletResponse resp) {
        Map<String, String> params = new HashMap<String, String>();
        params.put("func", "otsync.adminAuth");
        params.put("username", req.getParameter("username"));
        params.put("password", req.getParameter("password"));

        doAdminApiPost(resp, new CSForwardHeaders(req), params, true);
    }
}
