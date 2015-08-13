package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.http.HTTPRequest;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.payload.Payload;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.server.AbstractOTSyncServlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class NotifyMessageListener implements MessageForwarder {
	
	private final HTTPRequest _serverConnection;
	
	public NotifyMessageListener(HTTPRequest serverConnection) {
		_serverConnection = serverConnection;
	}
	
	public Payload forwardRequest(Payload payload)	throws IOException {

        AbstractOTSyncServlet.log.info("NotifyMessageListener#forwardRequest() what keys are in our map");
        for (String key : payload.getMap().keySet()) {
            AbstractOTSyncServlet.log.info("NotifyMessageListener#forwardRequest() - payload map key = " + key);
        }

		Map<String, String> params = new HashMap<>();

        // remove header values from the payload while it is being JSONified
        RequestHeader headers = (RequestHeader)payload.getValue(RequestHeader.REQUEST_HEADER_KEY);
        payload.remove(RequestHeader.REQUEST_HEADER_KEY);

        String contentServerUrl = ServletConfig.getContentServerUrl();
        String payloadJsonString = payload.getJsonString();

        AbstractOTSyncServlet.log.info("NotifyMessageListener#forwardRequest() - issuing post to CS url = " + contentServerUrl);
        AbstractOTSyncServlet.log.info("We attempt to call CS func otsync.otsyncrequest, passing payload String " + payloadJsonString);


        params.put("func", "otsync.otsyncrequest");
        params.put("payload", payloadJsonString);

        String in = _serverConnection.postData(ServletConfig.getContentServerUrl(), params, headers);

        AbstractOTSyncServlet.log.info("NotifyMessageListener#forwardRequest() - we got String result from CS =" + in);

		Payload result = new Payload(in);
		if (Message.GET_SYNC_TREE_VALUE.equals(payload.getValueAsString(Message.SUBTYPE_KEY_NAME))){
			// TODO FIXME very weird what is this used for???
			//result.setValue("minSeqNo", NotificationService.getMinSeqNum());
			//result.setValue("maxSeqNo", NotificationService.getMaxSeqNum());
		}
		
		return result;
	}
}
