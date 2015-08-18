package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.payload.Payload;
import com.opentext.otag.api.services.client.NotificationsClient;
import com.opentext.otag.api.shared.types.notification.NotificationSeqBounds;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class NotifyMessageListener implements MessageForwarder {

    private static final Log LOG = LogFactory.getLog(NotifyMessageListener.class);

    private final HTTPRequestManager _serverConnection;
    private final NotificationsClient notificationsClient;

    public NotifyMessageListener(HTTPRequestManager serverConnection,
                                 NotificationsClient notificationsClient) {
        _serverConnection = serverConnection;
        this.notificationsClient = notificationsClient;
    }

    public Payload forwardRequest(Payload payload) throws IOException {

        Map<String, String> params = new HashMap<>();

        // remove header values from the payload while it is being JSONified
        RequestHeader headers = (RequestHeader) payload.getValue(RequestHeader.REQUEST_HEADER_KEY);
        payload.remove(RequestHeader.REQUEST_HEADER_KEY);

        params.put("func", "otsync.otsyncrequest");
        params.put("payload", payload.getJsonString());

        String in = _serverConnection.postData(ContentServerService.getCsUrl(), params, headers);

        Payload result = new Payload(in);

        // ask the Gateway where it is in terms of the notifications sequence numbers
        NotificationSeqBounds notificationSeqBounds = notificationsClient.getNotificationsMinMaxSeq();
        if (notificationSeqBounds != null) {
            if (Message.GET_SYNC_TREE_VALUE.equals(payload.getValueAsString(Message.SUBTYPE_KEY_NAME))) {
                result.setValue("minSeqNo", notificationSeqBounds.getCurrentMinSeq());
                result.setValue("maxSeqNo", notificationSeqBounds.getCurrentMaxSeq());
            }
        } else {
            LOG.error("Failed to retrieve the Notifications sequence bounds");
        }

        return result;
    }
}
