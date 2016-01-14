package com.opentext.otsync.content.listeners;

import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.message.SynchronousMessageListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;

/**
 * Directs messages to the appropriate listener, then returns the response to the client.
 */
public class SynchronousMessageSwitch {

    private static final Log LOG = LogFactory.getLog(SynchronousMessageSwitch.class);

    private Map<String, SynchronousMessageListener> listeners = new HashMap<>();

    public void processAndRespondTo(Message message) {
        String type = message.getType();
        SynchronousMessageListener listener = listeners.get(type);

        if (listener != null) {

            try {
                Map<String, Object> response = listener.onMessage(message.getMap());
                respond(message, response);

            } catch (SocketTimeoutException e) {
                LOG.warn("Timed out waiting for Content Server.");
                try {
                    // null message sends a string, which clients will interpret as an unrecoverable error.
                    // In general, the client should already have timed out the request, so will not see this response.
                    message.getResponseHandler().send(null);
                } catch (IOException e1) {
                    // client has gone away
                }
            } catch (IOException e) {
                // if the message could not be delivered, send back an http error
                message.getResponseHandler().error("Could not deliver message to Content Server");
            }
        } else {
            LOG.warn("Got bad message type: " + type);
            message.getResponseHandler().error("Invalid message type: " + type);
        }
    }

    private void respond(Message message, Map<String, Object> response) {
        try {

            if (response != null) {
                message.getResponseHandler().send(response);
            }

        } catch (IOException e) {
            LOG.warn("Could not send synchronous response", e);
        } catch (IllegalStateException | NullPointerException e) {
            LOG.debug("Could not send synchronous response: client seems to have disconnected");
        }
    }

    /**
     * Not thread safe. Sets the given handler for the given type, replacing the existing one if any.
     */
    public synchronized void setHandler(SynchronousMessageListener handler, String type) {
        listeners.put(type, handler);
    }
}
