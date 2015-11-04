package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.message.SynchronousMessageListener;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Responds to messages of type "serverCheck" so clients can avoid accidentally talking to a non-otsync site.
 */
public class ServerCheckListener implements SynchronousMessageListener {

    public Map<String, Object> onMessage(Map<String, Object> message)
            throws IOException {

        Map<String, Object> result = new HashMap<>();
        if (Boolean.TRUE.equals(message.get(Message.REST_API_KEY_NAME))) {
            result.put(Message.OK_KEY_VALUE, true);
        } else {
            Map<String, Object> info = new HashMap<>();
            info.put(Message.OK_KEY_VALUE, true);
            result.put(Message.INFO_KEY_NAME, info);
        }

        return result;
    }

}
