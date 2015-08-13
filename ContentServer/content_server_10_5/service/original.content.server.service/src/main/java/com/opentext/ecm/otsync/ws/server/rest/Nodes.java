package com.opentext.ecm.otsync.ws.server.rest;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServerConstants;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class Nodes extends ResourcePath {
	
	public Nodes() {
		this.addSubPath(new NodePerms());
		this.addSubPath(new NodeID());
	}
	
	@Override
	protected String getPath() {
		return "nodes";
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String filter = req.getParameter(Message.FILTER_KEY_NAME);
		
		if(filter == null) {
			getRootSyncTree(req);
		}
		else {
			search(req, filter);
		}
	}

	private void getRootSyncTree(HttpServletRequest req) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SYNC_TREE_VALUE, req);
		Message.infoPut(payload, Message.MAX_RESULTS_KEY_NAME, req.getParameter(Message.LIMIT_KEY_NAME));
		Message.infoPut(payload, Message.MAX_DEPTH_KEY_NAME, req.getParameter(Message.MAX_DEPTH_KEY_NAME));
		Message.infoPut(payload, Message.FIELDS_KEY_NAME, req.getParameter("fields"));

		// enqueue=true
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, true);
	}

	private void search(HttpServletRequest req, String filter) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SEARCH_VALUE, req);
		Message.infoPut(payload, Message.QUERY_KEY_NAME, filter);
		boolean descending = Boolean.parseBoolean(req.getParameter(Message.DESCENDING_KEY_NAME));
		Message.infoPut(payload, Message.ASCENDING_KEY_NAME, Boolean.toString(!descending));
		Message.infoPut(payload, Message.SORT_KEY_NAME, req.getParameter(Message.SORT_KEY_NAME));
		Message.infoPut(payload, Message.NODE_TYPES_KEY_NAME, req.getParameter(Message.NODE_TYPES_KEY_NAME));
		Message.infoPut(payload, Message.IDS_KEY_NAME, req.getParameter(Message.IDS_KEY_NAME));
		boolean isTempoSearch = Boolean.parseBoolean(req.getParameter(Message.ISTEMPOSEARCH_KEY_NAME));
		Message.infoPut(payload, Message.ISTEMPOSEARCH_KEY_NAME, Boolean.toString(isTempoSearch));
		boolean isNameOnlySearch = Boolean.parseBoolean(req.getParameter(Message.ISNAMEONLYSEARCH_KEY_NAME));
		Message.infoPut(payload, Message.ISNAMEONLYSEARCH_KEY_NAME, Boolean.toString(isNameOnlySearch));
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
