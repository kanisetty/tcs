package com.opentext.ecm.otsync.ws.server.rest;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class NodeHistory extends ResourcePath {
	@Override
	protected String getPath() {
		return "history";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = NodeID.getNodeID(pathParams);
		
		getAuditHistory(req, node);
	}

	private void getAuditHistory(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_HISTORY_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		Message.infoPut(payload, Message.MAX_HISTORY_SIZE_KEY, req.getParameter(Message.MAX_HISTORY_SIZE_KEY));
		Message.infoPut(payload, Message.NUM_ROWS_KEY_NAME, req.getParameter(Message.PAGE_SIZE_KEY_NAME));
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
