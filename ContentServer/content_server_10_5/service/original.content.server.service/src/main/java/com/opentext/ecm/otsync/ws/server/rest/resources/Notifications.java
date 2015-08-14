package com.opentext.ecm.otsync.ws.server.rest.resources;


import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// TODO FIXME Another strange one, looks like we are proxying through to OTAG, why not just call otag?? part of the facade i guess
public class Notifications extends ResourcePath {
	
	private static final ObjectMapper mapper = new ObjectMapper();

	@Override
	protected String getPath() {
		return "notifications";
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
//		String since = req.getParameter(Message.SEQ_NO_REST_KEY_NAME);
//		String clientID = req.getParameter(Message.CLIENT_ID_KEY_NAME);
//		String token = getToken(req);
//		String eventLog = req.getParameter(Message.EVENT_LOG_KEY_NAME);
//		String shortPoll = req.getParameter(Message.SHORT_POLL_KEY_NAME);
//		boolean isShortPoll = false;
//
//		IdentityService identityService = IdentityProvider.getService();
//
//		try{
//			User user = identityService.getAuthorizedUser(token);
//
//			if (shortPoll != null){
//				isShortPoll = Boolean.parseBoolean(shortPoll);
//			}
//
//			if (eventLog != null){
//				//The event log parameter is deprecated in the new API and simply prevents long polling just like shortPoll
//				isShortPoll = Boolean.parseBoolean(eventLog);
//			}
//
//			if(version >= 4){
//
//				long seqNo;
//
//				try{
//					seqNo = Long.parseLong(since);
//				}
//				catch (NumberFormatException e){
//					ResourcePath.rejectRequest(resp);
//					return;
//				}
//
//				NotificationService.getEventsOrConnect(req, resp, user.getUsername(), clientID, seqNo, isShortPoll, token);
//			}
//			else {
//				NotificationService.connectLegacyBackchannel(req, resp, user.getUsername(), clientID, isShortPoll, token);
//			}
//		}
//		catch (WebApplicationException e) {
//			try{
//				Map<String, Object> replyMessage = new HashMap<String, Object>();
//                Map<String, Object> replyInfo = new HashMap<String, Object>();
//                replyInfo.put(Message.AUTH_KEY_VALUE, false);
//                replyMessage.put(Message.AUTH_KEY_VALUE, false);
//                replyMessage.put(Message.INFO_KEY_NAME, replyInfo);
//
//                String reply = mapper.writeValueAsString(replyMessage);
//                ServletUtil.write(resp, reply);
//			}
//			catch (IOException e1) {
//			}
//		}

	}
}