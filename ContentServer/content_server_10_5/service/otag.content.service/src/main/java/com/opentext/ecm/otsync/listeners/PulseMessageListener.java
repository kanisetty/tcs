package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.payload.Payload;
import com.opentext.otag.rest.util.CSForwardHeaders;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class PulseMessageListener implements MessageForwarder {

    private static final String PULSE_NODE_ID_KEY = "in_comment_on_obj_id";
    private static final String PULSE_REPLYTO_DEFAULT = "-1";
    private static final String PULSE_REPLYTO_KEY = "in_reply_to_status_id";
    private static final String PULSE_STATUS_KEY = "status";
    private static final String PULSE_NODE_ID = "data_id";
    private static final String PULSE_UPDATE_PATH = "/pulse/statuses/update";
    private static final String PULSE_COMMENTS_PATH = "/pulse/statuses/public_timeline";

    private final HTTPRequestManager _serverConnection;

    public PulseMessageListener(HTTPRequestManager serverConnection) {
        _serverConnection = serverConnection;
    }

    public Payload forwardRequest(Payload payload) throws IOException {

        Payload response;
        String subtype = payload.getValueAsString(Message.SUBTYPE_KEY_NAME);

        if (subtype.equalsIgnoreCase(Message.PULSE_SUBTYPE_GET_COMMENTS)) {
            response = getComments(payload);
        } else if (subtype.equalsIgnoreCase(Message.PULSE_SUBTYPE_ADD_COMMENT)) {
            response = addComment(payload);
        } else {
            response = new Payload();
            response.setValue(Message.TYPE_KEY_NAME, Message.PULSE_KEY_VALUE);
            Map<String, Object> info = new HashMap<>();
            info.put(Message.OK_KEY_VALUE, Boolean.FALSE.toString());
            info.put(Message.ERROR_KEY_RESPONSE, "Invalid subtype");
            response.setValue(Message.INFO_KEY_NAME, info);
        }

        // the methods for dealing with subtypes should produce a json info packet
        // and a type field identifying this as a pulse response;
        // we just need to add the subtype for the client's convenience
        response.setValue(Message.SUBTYPE_KEY_NAME, subtype);

        return response;
    }

    private Payload getComments(Payload payload) throws IOException {
        Payload info = payload.getInfo();
        Map<String, String> params = new HashMap<>();
        String url = ContentServerService.getCsUrl() + PULSE_COMMENTS_PATH;

        //Add Params
        params.put(PULSE_NODE_ID, info.getValueAsString(Message.NODE_ID_KEY_NAME));

        // remove header values from the payload
        CSForwardHeaders headers = (CSForwardHeaders) payload.getValue(CSForwardHeaders.REQUEST_HEADER_KEY);
        payload.remove(CSForwardHeaders.REQUEST_HEADER_KEY);

        String in = _serverConnection.postData(url, params, headers);

        return preparePulseResponse(in);
    }

    private Payload preparePulseResponse(String in) throws IOException {
        // what comes back from pulse is a JSON array, but it needs to be properly
        // wrapped as a field value so that it qualifies as correct JSON
        String jsonResponse = "{\"" + Message.PULSE_KEY_RESPONSE + "\":" + in + "}"; // {"info":[json array]}
        Payload responsePayload = new Payload(jsonResponse);

        // set the type field to indicate that this is a pulse response
        responsePayload.setValue(Message.TYPE_KEY_NAME, Message.PULSE_KEY_VALUE);
        return responsePayload;
    }

    private Payload addComment(Payload payload) throws IOException {
        Payload info = payload.getInfo();
        Map<String, String> params = new HashMap<>();

        // prepare url and parameters
        params.put(PULSE_STATUS_KEY, info.getValueAsString(Message.PULSE_STATUS_KEY_NAME));
        params.put(PULSE_REPLYTO_KEY, PULSE_REPLYTO_DEFAULT);
        params.put(PULSE_NODE_ID_KEY, info.getValueAsString(Message.NODE_ID_KEY_NAME));
        String url = ContentServerService.getCsUrl() + PULSE_UPDATE_PATH;

        // remove header values from the payload
        CSForwardHeaders headers = (CSForwardHeaders) payload.getValue(CSForwardHeaders.REQUEST_HEADER_KEY);
        payload.remove(CSForwardHeaders.REQUEST_HEADER_KEY);

        String in = _serverConnection.postData(url, params, headers);

        return preparePulseResponse(in);
    }

}
