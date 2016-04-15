package com.opentext.otsync.content.listeners;

import com.opentext.otag.sdk.client.v3.NotificationsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.notification.NotificationRequest;
import com.opentext.otsync.content.message.SynchronousMessageListener;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.payload.Payload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

/**
 * Handles requests to begin an upload or download. This api is deprecated and has no effect except to
 * generate a back-channel message.
 *
 */
public class ContentRequestListener implements SynchronousMessageListener {

	private static Log log = LogFactory.getLog(ContentRequestListener.class);

    private NotificationsClient notificationsClient;

    public ContentRequestListener(NotificationsClient notificationsClient) {
        this.notificationsClient = notificationsClient;
    }

	public Map<String, Object> onMessage(Map<String, Object> message) {
		String clientId = (String) message.get(Message.CLIENT_ID_KEY_NAME);
		String clientIp = (String) message.get(Message.REMOTE_ADDRESS_KEY_NAME);
		String subtype = (String) message.get(Message.SUBTYPE_KEY_NAME);
		
		if(clientId == null || clientIp == null || subtype == null){
			// can't process without all of these fields; log and discard
			log.warn("Client did not supply an id, clientIp, or subtype");
			return new HashMap<>();
		}
		
		sendAuthorizeMessage(clientId, subtype);
		
		return new HashMap<>();
	}

	private void sendAuthorizeMessage(String clientId, String subtype) {
		Payload message = new Payload();
		
		try {
			message.setValue(Message.TYPE_KEY_NAME, Message.CONTENT_KEY_VALUE);
			message.setValue(Message.SUBTYPE_KEY_NAME, subtype);

            NotificationRequest request = new NotificationRequest(
                    message.getJsonString(), new HashSet<>(Collections.singletonList(clientId)), new HashSet<>());
			notificationsClient.sendNotification(request);

		} catch (IOException e) {
			// couldn't send the authorization, for whatever reason
			log.warn("Could not send upload or download authorization", e);
		} catch (APIException e) {
			log.error("Failed to send notification via Gateway - " + e.getCallInfo());
		}
	}


}
