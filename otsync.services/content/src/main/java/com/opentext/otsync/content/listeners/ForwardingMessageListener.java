package com.opentext.otsync.content.listeners;

import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.message.SynchronousMessageListener;
import com.opentext.otsync.content.payload.Payload;
import com.opentext.otsync.content.ws.server.ClientSet;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.Map;

public class ForwardingMessageListener implements SynchronousMessageListener {

    private static final Log log = LogFactory.getLog(ForwardingMessageListener.class);
    private final MessageForwarder forwarder;
    private final ClientSet clients;

    public ForwardingMessageListener(final MessageForwarder forwarder, final ClientSet clients) {
        this.forwarder = forwarder;
        this.clients = clients;
    }

    public Map<String, Object> onMessage(Map<String, Object> message) throws IOException {

        String id = null;
        if (message.containsKey(Message.TRANSACTIONID_KEY_NAME)) {
            id = message.get(Message.TRANSACTIONID_KEY_NAME).toString();
        } else if (message.containsKey(Message.ID_KEY_NAME)) {
            id = message.get(Message.ID_KEY_NAME).toString();
        }

        Object clientIdObject = message.get(Message.CLIENT_ID_KEY_NAME);
        String clientId = clientIdObject != null? clientIdObject.toString() : null;

        // If we have a stored response for this client and message id, return it
        // Note that if the request is in progress, the response may just be {"pending":"true"}
        // Note also that if there is no client object for this client id, it will be created by this call
        Map<String, Object> response = clients.getLastResponseFor(clientId, id);

        // otherwise, forward the message and remember the response
        if (response == null) {

            clients.setRequestPending(clientId, id);

            response = getNewResponse(message, clientId, id);

            clients.setLastResult(clientId, id, response);
        }

        return response;
    }

    private Map<String, Object> getNewResponse(Map<String, Object> message, String clientId, String id)
            throws IOException {

        Payload payload = new Payload(message);
        Map<String, Object> ret;

        try {

            Payload responsePayload = forwarder.forwardRequest(payload);
            ret = responsePayload.getMap();

        } catch (SocketTimeoutException e) {
            // logging handled by caller
            // remember the exception
            clients.setLastResult(clientId, id, e);
            throw (e);
        } catch (IOException e) {
            log.warn("Could not forward request", e);

            // remember the exception
            clients.setLastResult(clientId, id, e);

            // rethrow so the caller can return an HTTP error
            throw (e);
        }

        return ret;
    }
}
