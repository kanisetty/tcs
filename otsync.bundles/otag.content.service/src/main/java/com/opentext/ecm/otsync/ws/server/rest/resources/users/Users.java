package com.opentext.ecm.otsync.ws.server.rest.resources.users;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

public class Users extends ResourcePath {

    public Users() {
        this.addSubPath(new UserID());
    }

    @Override
    protected String getPath() {
        return "users";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String searchFilter = req.getParameter(Message.FILTER_KEY_NAME);
        if (searchFilter == null) searchFilter = "";
        String dir = req.getParameter(Message.SORT_DIRECTION_NAME);
        if (dir == null) dir = "";
        String sort = req.getParameter(Message.SORT_KEY_NAME);
        if (sort == null) sort = "";
        String limit = req.getParameter(Message.LIMIT_KEY_NAME);
        if (limit == null) limit = "";

        userSearch(req, searchFilter, sort, dir, limit);
    }

    private void userSearch(HttpServletRequest req, String searchFilter, String sort, String dir, String limit) {
        HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.USER_SEARCH_VALUE, req);
        Message.infoPut(payload, Message.USER_QUERY_KEY_NAME, searchFilter);
        Message.infoPut(payload, Message.SORT_KEY_NAME, sort);
        Message.infoPut(payload, Message.SORT_DIRECTION_NAME, dir);
        Message.infoPut(payload, Message.LIMIT_KEY_NAME, limit);

        getFrontChannel().sendFrontChannelPayload(req, payload, false);
    }
}
