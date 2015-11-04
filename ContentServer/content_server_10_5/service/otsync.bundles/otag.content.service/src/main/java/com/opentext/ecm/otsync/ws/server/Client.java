package com.opentext.ecm.otsync.ws.server;

import com.opentext.ecm.otsync.listeners.RememberedResponses;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

/*
 * Stores back-end responses for a client so it can retrieve them even after a timeout.
 */
public class Client {

    private final String _userId;
    private final String _clientId;
    private Date _lastConnectTime;
    private final RememberedResponses _responses;

    public static final Log log = LogFactory.getLog(Client.class);

    public Client(final String userId, final String clientId, final int maxStoredResponses) {
        this._userId = userId;
        this._clientId = clientId;
        _lastConnectTime = new Date();
        _responses = new RememberedResponses(maxStoredResponses);
    }

    public Map<String, Object> getLastResult(String id) throws IOException {
        return _responses.getLastResult(id);
    }

    public void setRequestPending(String id) {
        // set last connect time when a request is started; this way clients will be discarded
        // started with the one that least recently sent a cacheable request
        setLastConnectTime();
        _responses.setRequestPending(id);
    }

    public void setLastResult(String messageId, Map<String, Object> lastResult) {
        _responses.setLastResult(messageId, lastResult);
    }

    public void setLastResult(String messageId, IOException e) {
        _responses.setLastResult(messageId, e);
    }

    public synchronized void close() {
        // no action needed
    }

    public synchronized void closeAndSendAuthFalse() {
        // no action needed
    }

    public String getUserId() {
        return _userId;
    }

    public String getClientId() {
        return _clientId;
    }

    public boolean equals(Object o) {
        if (!(o instanceof Client))
            return false;

        return _clientId == ((Client) o)._clientId;
    }

    public int hashCode() {
        return _clientId.hashCode();
    }

    public Date getLastConnectTime() {
        return _lastConnectTime;
    }

    public void setLastConnectTime() {
        _lastConnectTime = new Date();
    }

    /**
     * Notifies this object that the client has just successfully authorized.
     */
    public void authorize() {
        // no need for any action
    }

}
