package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import com.opentext.otag.api.services.client.IdentityServiceClient;
import com.opentext.otag.api.shared.types.auth.User;
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

	private static Log log = LogFactory.getLog(Servlet3BackChannel.class);

	private final MessageConverter messageConverter;
	private final IdentityServiceClient identityServiceClient;
	private final HTTPRequestManager httpRequestManager;

    public Servlet3BackChannel(MessageConverter messageConverter,
							   IdentityServiceClient identityServiceClient,
							   HTTPRequestManager httpRequestManager) {
        this.messageConverter = messageConverter;
		this.identityServiceClient = identityServiceClient;
		this.httpRequestManager = httpRequestManager;
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) {
    	String in = null;
    	boolean authSucceeded = false;
    	
    	try {
    		ServletUtil.ensureMethod(request, response, ContentServiceConstants.METHOD_POST);
    		ServletUtil.ensureMediaType(request, response, ContentServiceConstants.MEDIA_TYPE_JSON);
    		
    		//message comes in de-serialize it into a hash map
    		in = ServletUtil.readString(request);

    		if (!"".equals(in)) {
    			Map<String, Object> message = messageConverter.getDeserializer().deserialize(in);

    			//make sure it de-serialized fine and set the ClientMessage request and response
    			if (message != null) {

    				String clientId = Message.getFieldAsString(message, Message.CLIENT_ID_KEY_NAME);
    				if (!"".equals(clientId)) {
    				    String token = Message.getFieldAsString(message, Message.TOKEN_KEY_NAME);
    			        String subtype = Message.getFieldAsString(message, Message.SUBTYPE_KEY_NAME);
    			        boolean isShortPoll = Message.BACKCHANNEL_SUBTYPE_SHORT_POLL.equalsIgnoreCase(subtype);

    			        try {
							User user = identityServiceClient.getUserForToken(token, false);

    			        	connectLegacyBackchannel(request, response, user.getUserName(), clientId, isShortPoll, token);
    			        	authSucceeded = true;
    			        } catch (WebApplicationException e){
    			        	authSucceeded = false;
			        	}
                    }
                }
			}
    		
            if (!authSucceeded) {
                //we need to kill the connection here; send an auth failed message
                Map<String, Object> replyMessage = new HashMap<>();
                Map<String, Object> replyInfo = new HashMap<>();
                replyInfo.put(Message.AUTH_KEY_VALUE, false);
                replyMessage.put(Message.INFO_KEY_NAME, replyInfo);

                String reply = messageConverter.getSerializer().serialize(replyMessage);
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

	// TODO FIXME this could be problematic, revisit ASAP
	private void connectLegacyBackchannel(HttpServletRequest request, HttpServletResponse response,
										  String userName, String clientId, boolean isShortPoll, String token) {
		// we need to pass this request over the wire to connect the
		// requester directly to the backchannel!!!
		//httpRequestManager
	}
}
