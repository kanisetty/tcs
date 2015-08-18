package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.SettingsService;
import com.opentext.ecm.otsync.engine.core.SuspendedActionQueue;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.listeners.SynchronousMessageSwitch;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import com.opentext.ecm.otsync.ws.server.ResponseHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonProcessingException;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

public class Servlet3FrontChannel {

    private final SuspendedActionQueue _sharedThreadPool;
    private final MessageConverter _messageConverter;
    private final SynchronousMessageSwitch _messageHandler;
    private final SettingsService settingsService;

    public static final Log log = LogFactory.getLog(Servlet3FrontChannel.class);

    public Servlet3FrontChannel(SuspendedActionQueue sharedThreadPool,
                                MessageConverter messageConverter,
                                SynchronousMessageSwitch messageHandler,
                                SettingsService settingsService) {
        _sharedThreadPool = sharedThreadPool;
        _messageConverter = messageConverter;
        _messageHandler = messageHandler;
        this.settingsService = settingsService;
    }

    public void handle(HttpServletRequest request) {
        AsyncContext asyncRequest = null;
        HttpServletResponse response = null;
        String in = null;
        try {
            asyncRequest = request.startAsync();
            response = (HttpServletResponse) asyncRequest.getResponse();
            asyncRequest.setTimeout(settingsService.getServlet3RequestTimeout());

            ServletUtil.ensureMethod(request, response, ContentServiceConstants.METHOD_POST);
            ServletUtil.ensureMediaType(request, response, ContentServiceConstants.MEDIA_TYPE_JSON);

            in = ServletUtil.readString(request);
            if (!"".equals(in)) {
                // convert the message to a map of keys and values, and add in the callers ip address for possible
                // use in authorization by message listeners
                Map<String, Object> payload = _messageConverter.getDeserializer().deserialize(in);
                payload.put(Message.REMOTE_ADDRESS_KEY_NAME, request.getRemoteAddr());

                // enqueue certain requests unless auto=false (desktop clients may make these calls all at once on Engine restart)
                String subtype = (String) payload.get(Message.SUBTYPE_KEY_NAME);
                if (Message.GET_SYNC_TREE_VALUE.equalsIgnoreCase(subtype)
                        || Message.GET_SHARE_COUNT_VALUE.equalsIgnoreCase(subtype)
                        || Message.AUTH_KEY_VALUE.equalsIgnoreCase(subtype)) {

                    boolean enqueue = !Boolean.FALSE.equals(payload.get("auto"));
                    sendFrontChannelPayload(request, asyncRequest, payload, null, enqueue);
                } else {
                    sendFrontChannelPayload(request, asyncRequest, payload, null, false);
                }
            } else {
                log.debug("Got empty front-channel message");
                response.getOutputStream().close();
            }
        } catch (JsonProcessingException ex) {
            log.warn("Error in request contents", ex);
            if (response != null) {
                ServletUtil.error(response, "Invalid JSON format", HttpServletResponse.SC_BAD_REQUEST);
            }
            asyncRequest.complete();
        } catch (IOException ioe) {
            if (in != null) {
                log.warn("Error processing request", ioe);
                if (response != null) {
                    ServletUtil.error(response, "Bad Message", HttpServletResponse.SC_BAD_REQUEST);
                }
            } else {
                log.info("Front-channel request closed before contents could be read");
            }
            asyncRequest.complete();
        }
    }

    public MessageConverter getMessageConverter() {
        return _messageConverter;
    }

    public void sendFrontChannelPayload(HttpServletRequest request, Map<String, Object> payload, boolean enqueue) {
        sendFrontChannelPayload(request, payload, null, enqueue);
    }

    public void sendFrontChannelPayload(HttpServletRequest request, Map<String, Object> payload, Map<String, Object> extraData, boolean enqueue) {
        AsyncContext asyncRequest = request.startAsync();
        asyncRequest.setTimeout(settingsService.getServlet3RequestTimeout());
        sendFrontChannelPayload(request, asyncRequest, payload, extraData, enqueue);
    }

    private void sendFrontChannelPayload(HttpServletRequest request, AsyncContext asyncRequest, Map<String, Object> payload,
                                         Map<String, Object> extraData, boolean enqueue) {
        // get the forwarded-for header if it exists
        RequestHeader headers = new RequestHeader(request, payload);
        payload.put(RequestHeader.REQUEST_HEADER_KEY, headers);

        // create a response handler that will connect the message to this comet event, and
        // pass the message on to the notification service for handling by registered listeners
        ResponseHandler responseHandler = new Servlet3ResponseHandler(asyncRequest, _messageConverter, extraData);
        Message message = new Message(payload, responseHandler, _messageHandler);

        if (enqueue) {
            _sharedThreadPool.send(message);
        } else {
            _sharedThreadPool.sendImmediately(message);
        }

    }
}
