package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

public class NodeTasks extends ResourcePath {

    @Override
    protected String getPath() {
        return "task";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);

        getTasks(req, node);
    }

    private void getTasks(HttpServletRequest req, String node) {
        HashMap<String, Object> payload = Message.makePayload(
                Message.NOTIFY_KEY_VALUE, Message.GET_TEMPO_TASKS_VALUE, req);
        Message.infoPut(payload, Message.FOLDER_ID_KEY_NAME, node);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp,
                          String[] pathParams, int version) {

        String parentNode = NodeID.getNodeID(pathParams);
        String name = req.getParameter(Message.NAME_KEY_NAME);

        createTask(req, parentNode, name);
    }

    private void createTask(HttpServletRequest req, String parentNode, String name) {
        HashMap<String, Object> payload = Message.makePayload(
                Message.NOTIFY_KEY_VALUE, Message.CREATE_TEMPO_TASKS_VALUE, req);
        Message.infoPut(payload, Message.FOLDER_ID_KEY_NAME, parentNode);
        Message.infoPut(payload, Message.NAME_KEY_NAME, name);

        String assigneeString = req.getParameter(Message.ASSIGNED_TO_KEY_NAME);
        if (assigneeString != null) {
            Message.infoPut(payload, Message.ASSIGNED_TO_KEY_NAME, assigneeString);
        }

        String dueDateString = req.getParameter(Message.DUE_DATE_KEY_NAME);
        if (dueDateString != null) {
            Message.infoPut(payload, Message.DUE_DATE_KEY_NAME, dueDateString);
        }

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {

        String taskNode = NodeID.getNodeID(pathParams);
        String status = req.getParameter(Message.STATUS_KEY_NAME);

        updateTask(req, taskNode, status);
    }

    private void updateTask(HttpServletRequest req, String parentNode, String status) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.UPDATE_TEMPO_TASK_VALUE, req);
        Message.infoPut(payload, Message.TASK_ID_KEY_NAME, parentNode);
        Message.infoPut(payload, Message.STATUS_KEY_NAME, status);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }

}
