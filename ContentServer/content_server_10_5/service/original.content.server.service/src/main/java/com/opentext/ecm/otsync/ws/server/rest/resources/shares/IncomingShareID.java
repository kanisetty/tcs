package com.opentext.ecm.otsync.ws.server.rest.resources.shares;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServerConstants;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class IncomingShareID extends ResourcePath {
	private static final int SHARE_ID_PATH_INDEX = 2;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		getShareInfoForNode(req, getShareID(pathParams));
	}

	public static String getShareID(String[] pathParams) {
		return pathParams[SHARE_ID_PATH_INDEX];
	}

	private void getShareInfoForNode(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.GET_SHARE_INFO_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getShareID(pathParams);
		boolean accepted = ServerConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter(Message.ACCEPTED_KEY_NAME));
		boolean rejected = ServerConstants.TRUE_STRING.equalsIgnoreCase(req.getParameter(Message.REJECTED_KEY_NAME));
		boolean isNotifyChange = req.getParameter(Message.SHARE_NOTIFY_KEY_NAME) != null;
		
		if(isNotifyChange){
			setNotificationsForShare(req, node);
		}
		if(accepted) {
			acceptShare(req, node);
		}
		else if(rejected) {
			rejectShare(req, node);
		}
		else {
			rejectRequest(resp);
		}
	}

	private void setNotificationsForShare(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.SET_NOTIFY_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		Message.infoPut(payload, Message.SHARE_NOTIFY_KEY_NAME, Boolean.parseBoolean(req.getParameter(Message.SHARE_NOTIFY_KEY_NAME)));
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}

	private void acceptShare(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.ACCEPT_SHARE_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}

	private void rejectShare(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.REJECT_SHARE_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String node = getShareID(pathParams);
		unsubscribe(req, node);
	}

	private void unsubscribe(HttpServletRequest req, String node) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.UNSUBSCRIBE_VALUE, req);
		Message.infoPut(payload, Message.NODE_ID_KEY_NAME, node);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
