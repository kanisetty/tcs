package com.opentext.ecm.otsync.ws.server.rest.resources.shares;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

public class OutgoingShareID extends ResourcePath {
    private static final int SHARE_ID_PATH_INDEX = 2;

    public OutgoingShareID() {
        this.addSubPath(new OutgoingShareUsers());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        getShareInfoForNode(req, getShareID(pathParams));
    }

    public static String getShareID(String[] pathParams) {
        return pathParams[SHARE_ID_PATH_INDEX];
    }

    private void getShareInfoForNode(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SHARE_INFO_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = getShareID(pathParams);

        setNotificationsForShare(req, node);
    }

    private void setNotificationsForShare(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SET_NOTIFY_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.SHARE_NOTIFY_KEY_NAME, Boolean.parseBoolean(req.getParameter(Message.SHARE_NOTIFY_KEY_NAME)));

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
                            String[] pathParams, int version) {
        unshareAllFromNode(req, getShareID(pathParams));
    }

    private void unshareAllFromNode(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.UNSHARE_ALL_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }
}
