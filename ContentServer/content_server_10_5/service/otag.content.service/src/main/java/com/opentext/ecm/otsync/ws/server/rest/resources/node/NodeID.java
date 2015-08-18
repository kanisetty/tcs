package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NodeID extends ResourcePath {
    
    private static final int NODE_ID_PATH_INDEX = 1;

    public NodeID() {
        this.addSubPath(new NodeChildren());
        this.addSubPath(new NodePath());
        this.addSubPath(new NodeVersionHistory());
        this.addSubPath(new NodeHistory());
        this.addSubPath(new NodeContent());
        this.addSubPath(new NodeThumbnail());
        this.addSubPath(new NodeDetails());
        this.addSubPath(new CatData());
        this.addSubPath(new NodeTasks());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = getNodeID(pathParams);
        getObjectInfo(req, node);
    }

    public static String getNodeID(String[] pathParams) {
        return pathParams[NODE_ID_PATH_INDEX];
    }

    private void getObjectInfo(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_OBJECT_INFO_VALUE, req);
        List<String> nodeList = new ArrayList<>();
        nodeList.add(node);
        Message.infoPut(payload, Message.NODE_IDS_KEY_NAME, nodeList);
        Message.infoPut(payload, Message.FIELDS_KEY_NAME, req.getParameter("fields"));

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = getNodeID(pathParams);
        String newParent = req.getParameter(Message.PARENT_ID_KEY_NAME);
        String name = req.getParameter(Message.NAME_KEY_NAME);
        String hash = req.getParameter(Message.DATA_HASH_KEY_NAME);
        String reserve = req.getParameter(Message.RESERVE_KEY_NAME);

        if (newParent != null) {
            moveNode(req, node, newParent, name);
        } else if (name != null) {
            renameNode(req, node, name);
        } else if (hash != null && version < 4) {
            setHash(req, node, hash);
        } else if (reserve != null) {
            Boolean reserveBool = Boolean.valueOf(reserve);
            if (reserveBool) {
                reserveNode(req, node);
            } else {
                unreserveNode(req, node);
            }
        } else {
            rejectRequest(resp);
        }
    }

    private void unreserveNode(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.UNRESERVE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void reserveNode(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.RESERVE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void setHash(HttpServletRequest req, String node, String hash) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SET_HASH_VALUE, req);
        Map<String, Object> hashInfo = new HashMap<>();
        hashInfo.put(Message.NODE_ID_KEY_NAME, node);
        hashInfo.put(Message.DATA_HASH_KEY_NAME, hash);
        List<Map<String, Object>> hashList = new ArrayList<>();
        hashList.add(hashInfo);
        Message.infoPut(payload, Message.HASH_LIST_KEY_NAME, hashList);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void renameNode(HttpServletRequest req, String node, String name) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.RENAME_NODE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.NEW_NAME_KEY_NAME, name);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void moveNode(HttpServletRequest req, String node, String newParent, String name) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.MOVE_NODE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.PARENT_ID_KEY_NAME, newParent);
        Message.infoPut(payload, Message.NEW_NAME_KEY_NAME, name);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
                            String[] pathParams, int version) {
        String node = getNodeID(pathParams);
        deleteNode(req, node);
    }

    private void deleteNode(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.DELETE_NODE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }
}
