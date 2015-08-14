package com.opentext.ecm.otsync.ws.server.rest.resources.users;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class UserID extends ResourcePath {
	private static final int USER_ID_PATH_INDEX = 1;
	
	public UserID() {
		this.addSubPath(new UserPhoto());
		this.addSubPath(new UserSettings());
	}

	public static String getUserID(String[] pathParams) {
		return pathParams[USER_ID_PATH_INDEX];
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
		getQuota(req);
	};

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String user = getUserID(pathParams);
		
		changePassword(req, user);
	}
	
	private void getQuota(HttpServletRequest req) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.STORAGE_LIMIT_VALUE, req);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}

	private void changePassword(HttpServletRequest req, String user) {
		String oldPassword = req.getParameter(Message.OLD_PASSWORD_KEY_NAME);
		String password = req.getParameter(Message.PASSWORD_KEY_NAME);
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.CHANGE_PASSWORD_VALUE, req);
		Message.infoPut(payload, Message.NEW_PASSWORD_KEY, password);
		Message.infoPut(payload, Message.OLD_PASSWORD_KEY_NAME, oldPassword);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}
}
