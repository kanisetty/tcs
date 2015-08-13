package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServerConstants;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonProcessingException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Servlet3BackChannel {
	private static Log log = LogFactory.getLog(Class.class);
    private final MessageConverter _messageConverter;

    public Servlet3BackChannel(MessageConverter messageConverter) {
        _messageConverter = messageConverter;
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) {
    	String in = null;
    	boolean authSucceeded = false;
    	
    	try {
    		ServletUtil.ensureMethod(request, response, ServerConstants.METHOD_POST);
    		ServletUtil.ensureMediaType(request, response, ServerConstants.MEDIA_TYPE_JSON);
    		
    		//message comes in de-serialize it into a hash map
    		in = ServletUtil.readString(request);

    		if (!"".equals(in)) {
    			Map<String, Object> message = _messageConverter.getDeserializer().deserialize(in);

    			//make sure it de-serialized fine and set the ClientMessage request and response
    			if (message != null) {

    				String clientId = Message.getFieldAsString(message, Message.CLIENT_ID_KEY_NAME);
    				if (!"".equals(clientId)) {
    				    String token = Message.getFieldAsString(message, Message.TOKEN_KEY_NAME);
    			        String subtype = Message.getFieldAsString(message, Message.SUBTYPE_KEY_NAME);
    			        boolean isShortPoll = Message.BACKCHANNEL_SUBTYPE_SHORT_POLL.equalsIgnoreCase(subtype);

						// TODO FIXME more stepping on otags toes, this is a replicla almost of the class in there
    			        try {
//    			        	User user = IdentityProvider.getService().getAuthorizedUser(token);
//    			        	NotificationService.connectLegacyBackchannel(request, response, user.getUsername(), clientId, isShortPoll, token);
    			        	authSucceeded = true;
    			        } catch (WebApplicationException e){
    			        	authSucceeded = false;
			        	}
                    }
                }
			}
    		
            if (!authSucceeded) {
                //we need to kill the connection here; send an auth failed message
                Map<String, Object> replyMessage = new HashMap<String, Object>();
                Map<String, Object> replyInfo = new HashMap<String, Object>();
                replyInfo.put(Message.AUTH_KEY_VALUE, false);
                replyMessage.put(Message.INFO_KEY_NAME, replyInfo);

                String reply = _messageConverter.getSerializer().serialize(replyMessage);
                ServletUtil.write(response, reply);
            }
    		
    	}
    	catch (JsonProcessingException ex) {
    		log.warn("Error in request contents", ex);
    		if(response != null){
    			ServletUtil.error(response, "Invalid JSON format", HttpServletResponse.SC_BAD_REQUEST);
    		}
    	} 
    	catch (IOException ioe) {
    		if(in != null){
    			log.warn("Error processing request", ioe);
    			if(response != null){
    				ServletUtil.error(response, "Bad Message", HttpServletResponse.SC_BAD_REQUEST);
    			}
    		}
    		else {
    			log.info("Back-channel request closed before contents could be read");
    		}
    	}
    }
}
