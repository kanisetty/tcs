package com.opentext.ecm.otsync.ws.server.rest.resources.users;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.HTTPRequest;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.rest.resources.node.RESTDownloadAction;
import com.opentext.ecm.otsync.ws.server.rest.resources.node.RESTUploadAction;
import com.opentext.ecm.otsync.ws.server.servlet3.OTSyncServer;

public class UserPhoto extends ResourcePath {
	@Override
	protected String getPath() {
		return "photo";
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String user = UserID.getUserID(pathParams);
		
		downloadUserPhoto(req, user, resp);
	}

	private void downloadUserPhoto(HttpServletRequest req, String user, HttpServletResponse resp) {
		String llcookie = getCSToken(req);
		
		if(llcookie != null){
			String url = new StringBuilder()
				.append(ServletConfig.getContentServerUrl())
				.append("?func=otsync.GetUserPhoto&userID=")
				.append(user)
				.append("&cstoken=")
				.append(llcookie)
				.toString();
	
			AsyncContext asyncRequest = req.startAsync();
			asyncRequest.setTimeout(ServletConfig.getServlet3RequestTimeout());
			
			RequestHeader headers = new RequestHeader(req);
			
			HTTPRequest serverConnection = OTSyncServer.getServerConnection();
			
			SuspendedAction action = new RESTDownloadAction(serverConnection, asyncRequest, headers, url, llcookie);
			
			OTSyncServer.getContentChannel().sendDownload(action, false);
		}
		else {
			rejectRequest(resp);
		}
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {

		try {
			uploadProfilePhoto(req, resp);
		} catch (Exception e) {
			try {
				resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
			} catch (IOException ignored) {
			}
		}
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		resetUserPhoto(req);
	}

	private void resetUserPhoto(HttpServletRequest req) {
		HashMap<String, Object> payload = Message.makePayload(Message.NOTIFY_KEY_VALUE, Message.DELETE_PROFILE_PHOTO_VALUE, req);
		
		OTSyncServer.getFrontChannel().sendFrontChannelPayload(req, payload, false);
	}

	private void uploadProfilePhoto(HttpServletRequest req, HttpServletResponse resp) throws ServletException {
		HashMap<String, Object> payload = Message.makePayload(Message.CONTENT_TYPE_KEY_VALUE, Message.UPLOAD_PROFILE_PHOTO_KEY_VALUE, req);
		RESTUploadAction.uploadRequest(req, resp, payload, RESTUploadAction.PHOTO_UPLOAD_PART_NAME);
	}
}
