package com.opentext.ecm.otsync.ws.server.rest;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class NodeVersionHistory extends ResourcePath {
	@Override
	protected String getPath() {
		return "versionhistory";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = NodeID.getNodeID(pathParams);
		
		getVersionHistory(req, node);
	}

	private void getVersionHistory(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_VERSION_HISTORY_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
