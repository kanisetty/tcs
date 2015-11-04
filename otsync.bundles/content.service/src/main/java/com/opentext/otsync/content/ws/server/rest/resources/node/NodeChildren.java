package com.opentext.otsync.content.ws.server.rest.resources.node;

import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.message.Message;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

public class NodeChildren extends ResourcePath {
    @Override
    protected String getPath() {
        return "children";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);
        String filter = req.getParameter(Message.FILTER_KEY_NAME);

        if (filter != null) {
            search(req, node, filter);
        } else if (ContentServiceConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter(Message.RECURSIVE_KEY_NAME))) {
            getSyncTree(req, node);
        } else {
            getFolderContents(req, node);
        }
    }

    private void getFolderContents(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_FOLDER_CONTENTS_VALUE, req);
        Message.infoPut(payload, Message.CONTAINER_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.PAGE_KEY_NAME, req.getParameter(Message.PAGE_NUMBER_KEY_NAME));
        Message.infoPut(payload, Message.SORT_KEY_NAME, req.getParameter(Message.SORT_KEY_NAME));
        Message.infoPut(payload, Message.DESCENDING_KEY_NAME, req.getParameter(Message.DESCENDING_KEY_NAME));
        Message.infoPut(payload, Message.FIELDS_KEY_NAME, req.getParameter("fields"));
        Message.infoPut(payload, Message.TYPE_KEY_NAME, req.getParameter(Message.TYPE_KEY_NAME));
        Message.infoPut(payload, Message.VIRTUAL_KEY_NAME, req.getParameter(Message.VIRTUAL_KEY_NAME));

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void getSyncTree(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SYNC_TREE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
        Message.infoPut(payload, Message.MAX_RESULTS_KEY_NAME, req.getParameter(Message.LIMIT_KEY_NAME));
        Message.infoPut(payload, Message.MAX_DEPTH_KEY_NAME, req.getParameter(Message.MAX_DEPTH_KEY_NAME));
        Message.infoPut(payload, Message.FIELDS_KEY_NAME, req.getParameter("fields"));

        // enqueue=true
        getFrontChannel().sendFrontChannelPayload(req, payload, true);
    }

    private void search(HttpServletRequest req, String node, String filter) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SEARCH_VALUE, req);
        Message.infoPut(payload, Message.SEARCH_LOCATION_KEY_NAME, node);
        Message.infoPut(payload, Message.QUERY_KEY_NAME, filter);
        boolean descending = ContentServiceConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter(Message.DESCENDING_KEY_NAME));
        Message.infoPut(payload, Message.ASCENDING_KEY_NAME, Boolean.toString(!descending));
        Message.infoPut(payload, Message.SORT_KEY_NAME, req.getParameter(Message.SORT_KEY_NAME));

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {
        String parentNode = NodeID.getNodeID(pathParams);

        if (req.getContentType().startsWith(ContentServiceConstants.FILE_UPLOAD_TYPE)) {
            uploadNewDocument(req, resp, parentNode);
        } else {
            String sourceNode = req.getParameter(Message.COPY_FROM_KEY_NAME);
            String name = req.getParameter(Message.NAME_KEY_NAME);

            if (sourceNode != null) {
                copyNode(req, parentNode, sourceNode, name);
            } else if (name != null) {
                createFolder(req, parentNode, name);
            } else {
                rejectRequest(resp);
            }
        }
    }

    static private void uploadNewDocument(HttpServletRequest req, HttpServletResponse resp, String parentID) {
        HashMap<String, Object> payload = Message.makePayload(Message.CONTENT_TYPE_KEY_VALUE, Message.UPLOAD_KEY_VALUE, req);
        Message.infoPut(payload, Message.PARENT_ID_KEY_NAME, parentID);
        String attributesString = req.getParameter(Message.ATTRIBUTES_KEY_NAME);
        if (attributesString != null) {
            Message.infoPut(payload, Message.ATTRIBUTES_KEY_NAME, attributesString);
        }

        RESTUploadAction.uploadRequest(req, resp, payload, RESTUploadAction.FILE_UPLOAD_PART_NAME);
    }

    private void copyNode(HttpServletRequest req, String parentNode,
                          String sourceNode, String name) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.COPY_NODE_VALUE, req);
        Message.infoPut(payload, Message.NODE_ID_KEY_NAME, sourceNode);
        Message.infoPut(payload, Message.PARENT_ID_KEY_NAME, parentNode);
        Message.infoPut(payload, Message.NEW_NAME_KEY_NAME, name);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    private void createFolder(HttpServletRequest req, String parentNode, String name) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.CREATE_FOLDER_VALUE, req);
        Message.infoPut(payload, Message.PARENT_ID_KEY_NAME, parentNode);
        Message.infoPut(payload, Message.NAME_KEY_NAME, name);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

}
