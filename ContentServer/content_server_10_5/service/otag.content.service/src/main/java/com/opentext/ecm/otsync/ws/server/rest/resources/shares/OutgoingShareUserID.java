package com.opentext.ecm.otsync.ws.server.rest.resources.shares;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OutgoingShareUserID extends ResourcePath {
    private static final int USER_ID_PATH_INDEX = 4;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String nodeID = OutgoingShareID.getShareID(pathParams);
        String userID = getUserID(pathParams);
        share(req, nodeID, userID);
    }

    public static String getUserID(String[] pathParams) {
        return pathParams[USER_ID_PATH_INDEX];
    }

    private void share(HttpServletRequest req, String node, String user) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SHARE_VALUE, req);
        Map<String, Object> userInfo = new HashMap<String, Object>();
        userInfo.put(Message.USERLOGIN_KEY_NAME, user);
        userInfo.put(Message.SHARE_TYPE_KEY_NAME, req.getParameter(Message.SHARE_TYPE_KEY_NAME));
        List<Map<String, Object>> userList = new ArrayList<Map<String, Object>>();
        userList.add(userInfo);
        Message.infoPut(payload, Message.USER_LIST_KEY_NAME, userList);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String nodeID = OutgoingShareID.getShareID(pathParams);
        String userID = getUserID(pathParams);
        changeShareType(req, nodeID, userID);
    }

    private void changeShareType(HttpServletRequest req, String node, String user) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.CHANGE_SHARE_VALUE, req);
        Message.infoPut(payload, Message.USER_ID_KEY_RESPONSE, user);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.SHARE_TYPE_KEY_NAME, req.getParameter(Message.SHARE_TYPE_KEY_NAME));

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
                            String[] pathParams, int version) {
        String nodeID = OutgoingShareID.getShareID(pathParams);
        String userID = getUserID(pathParams);
        unshareFromUser(req, nodeID, userID);
    }

    private void unshareFromUser(HttpServletRequest req, String node, String user) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.UNSHARE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        List<String> userList = new ArrayList<String>();
        userList.add(user);
        Message.infoPut(payload, Message.USER_LIST_KEY_NAME, userList);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }
}
