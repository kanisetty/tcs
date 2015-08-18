package com.opentext.ecm.otsync.ws.server.rest.resources.shares;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class Incoming extends ResourcePath {

    public Incoming() {
        this.addSubPath(new IncomingShareID());
    }

    @Override
    protected String getPath() {
        return "incoming";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        getPendingShares(req);
    }

    private void getPendingShares(HttpServletRequest req) {
        Map<String, Object> payload;
        boolean enqueue = false;
        if (ContentServiceConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter(Message.COUNT_ONLY_VALUE))) {
            payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SHARE_COUNT_VALUE, req);
            // enqueue unless auto=false (desktop clients may make this call all at once on Engine restart)
            enqueue = !"false".equalsIgnoreCase(req.getParameter("auto"));
        } else {
            payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SHARE_LIST_VALUE, req);
        }

        getFrontChannel().sendFrontChannelPayload(req, payload, enqueue);
    }
}
