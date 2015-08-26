package com.opentext.ecm.otsync.ws.server.rest.resources;


import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.otag.api.shared.types.auth.User;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Notifications extends ResourcePath {
	
	private static final ObjectMapper mapper = new ObjectMapper();

	@Override
	protected String getPath() {
		return "notifications";
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String since = req.getParameter(Message.SEQ_NO_REST_KEY_NAME);
		String clientID = req.getParameter(Message.CLIENT_ID_KEY_NAME);
		String token = getToken(req);
		String eventLog = req.getParameter(Message.EVENT_LOG_KEY_NAME);
		String shortPoll = req.getParameter(Message.SHORT_POLL_KEY_NAME);
		boolean isShortPoll = false;

		try{
			User user = ContentServerService.getIdService().getUserForToken(token, false);
		
			if (shortPoll != null){				
				isShortPoll = Boolean.parseBoolean(shortPoll);
			}
			
			if (eventLog != null){
				//The event log parameter is deprecated in the new API and simply prevents long polling just like shortPoll
				isShortPoll = Boolean.parseBoolean(eventLog);
			}
	
			if(version >= 4){
				
				long seqNo;
			
				try{
					seqNo = Long.parseLong(since);
				}
				catch (NumberFormatException e){
					ResourcePath.rejectRequest(resp);
					return;
				}

				// TODO FIXME Another place we have to try and connect to the backchannel
				// TODO Servlet3Backchannel is trying to do the same thing!!
				//NotificationService.getEventsOrConnect(req, resp, user.getUsername(), clientID, seqNo, isShortPoll, token);
			} else {
				// TODO FIXME report failure to connect to legacy backchannel, deprecated

			}
		} catch (WebApplicationException e) {
			try {
				Map<String, Object> replyMessage = new HashMap<>();
                Map<String, Object> replyInfo = new HashMap<>();
                replyInfo.put(Message.AUTH_KEY_VALUE, false);
                replyMessage.put(Message.AUTH_KEY_VALUE, false);
                replyMessage.put(Message.INFO_KEY_NAME, replyInfo);

                String reply = mapper.writeValueAsString(replyMessage);
                ServletUtil.write(resp, reply);
			} catch (IOException ignored) {
			}
		}

	}
}