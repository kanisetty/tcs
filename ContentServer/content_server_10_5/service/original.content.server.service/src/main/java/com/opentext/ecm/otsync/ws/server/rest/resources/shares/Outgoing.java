package com.opentext.ecm.otsync.ws.server.rest.resources.shares;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class Outgoing extends ResourcePath {
	
	public Outgoing() {
		this.addSubPath(new OutgoingShareID());
	}
	
	@Override
	protected String getPath() {
		return "outgoing";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		getSharesOwnedByCurrentUser(req);
	}

	private void getSharesOwnedByCurrentUser(HttpServletRequest req) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SHARED_BY_USER_VALUE, req);
		Message.infoPut(payload, Message.SORT_ON_KEY_NAME, req.getParameter(Message.SORT_KEY_NAME));
		Message.infoPut(payload, Message.SORT_DESC_KEY_NAME, req.getParameter(Message.DESCENDING_KEY_NAME));

		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
