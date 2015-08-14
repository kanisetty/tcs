package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class NodePath extends ResourcePath {
	@Override
	protected String getPath() {
		return "path";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = NodeID.getNodeID(pathParams);
		
		getLocationPath(req, node);
	}

	private void getLocationPath(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_LOCATION_PATH_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
