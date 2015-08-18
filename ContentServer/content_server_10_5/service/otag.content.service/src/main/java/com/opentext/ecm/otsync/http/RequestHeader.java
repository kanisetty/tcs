package com.opentext.ecm.otsync.http;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.opentext.ecm.otsync.ContentServerService;
import org.apache.http.HttpMessage;

import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

/**
 * RequestHeader encapsulates header values that will be required
 * for future requests. The initial purpose is to allow headers from incoming
 * requests to be forwarded by subsequent requests.
 *
 * This also provides validation of headers such as x-forwarded-for which will
 * be set based on the IP of the incoming request as the OTSync engine is acting here
 * as an HTTP proxy.
 */
public class RequestHeader {

	private static final String IF_MODIFIED_SINCE = "If-Modified-Since";
	private static final String LANGUAGE_HEADER_KEY_NAME = "accept-language";
	private static final String USER_AGENT_HEADER_NAME = "user-agent";
	public final static String REQUEST_HEADER_KEY = "Request-Header-Helper";
	public final static String FORWARDED_FOR_HEADER_KEY_NAME = "X-Forwarded-For";
	public final static String OTCSTICKET_KEY_NAME = "OTCSTICKET";
	private static final String HTTP_REFERER_HEADER = "REFERER";
	private static final String CSTOKEN_KEY = "cstoken";

	private String remoteAddr;
	private String forwardHeader;
	private String userAgent;
	private String lang;
	private String ifModifiedSince;
	private String otcsTicket;

	public RequestHeader(final HttpServletRequest request){
		initialize(request);
    }
	
	public RequestHeader(final HttpServletRequest request, String llCookie){
		initialize(request);
		
		// It's possible here that there is no OTCSTICKET header if the request was invoked from an image source so update the ticket to
		// be the llcookie instead
		
		if ( this.otcsTicket == null || this.otcsTicket.length() == 0 ){
			this.otcsTicket = llCookie;
		}
    }
	
	public RequestHeader(final HttpServletRequest request, Map<String, Object> payload){
		initialize(request);
		
		// If an old client passed the cstoken in the payload make sure we add this to the header.
		
		if ( this.otcsTicket == null || this.otcsTicket.length() == 0 ){
			this.otcsTicket = (String) payload.get(CSTOKEN_KEY);
		}
    }
	
    public String getForwardHeader(){

        return this.forwardHeader;
    }

    public String getRemoteAddr(){

        return this.remoteAddr;
    }
    
    public String getOTCSTicket(){

        return this.otcsTicket;
    }
    
    public void setOTCSTicket(String otcsTicket){

        this.otcsTicket = otcsTicket;
    }
    
    public String getOriginalAddr(){
    	int commaIndex = forwardHeader.indexOf(',');
		return forwardHeader.substring(0, commaIndex >= 0 ? commaIndex : forwardHeader.length());
    }

    public void addTo(final HttpMessage request){
    	
    	if(userAgent != null){
    		request.addHeader(USER_AGENT_HEADER_NAME, this.userAgent);
    	}
    	
    	if(lang != null){
    		request.addHeader(LANGUAGE_HEADER_KEY_NAME, lang);
    	}
    	
    	if(ifModifiedSince != null){
    		request.addHeader(IF_MODIFIED_SINCE, ifModifiedSince);
    	}

        // need to set the forwarded-for header to preserve communication chain
        request.addHeader(FORWARDED_FOR_HEADER_KEY_NAME, this.forwardHeader);

        // need to set the referer to the CS location to pass CSRF checks
        request.addHeader(HTTP_REFERER_HEADER, ContentServerService.getCsUrl());
        
        // need to set the OTCSTICKET into the request
        request.addHeader(OTCSTICKET_KEY_NAME, this.otcsTicket);
    }
    
    private void initialize(final HttpServletRequest request){
		this.remoteAddr = request.getRemoteAddr();
		this.lang = request.getHeader(LANGUAGE_HEADER_KEY_NAME);
		this.ifModifiedSince = request.getHeader(IF_MODIFIED_SINCE);
		this.otcsTicket = request.getHeader(OTCSTICKET_KEY_NAME);
		
		/*
		 * Append the incoming REMOTE_ADDR to the list of X-Forwarded-For values
		 */
		String forward = request.getHeader(FORWARDED_FOR_HEADER_KEY_NAME);
		
        if(forward == null || forward.isEmpty())
        {
            forward = this.remoteAddr;
        }else
        {
            forward = forward.concat(",");
            forward = forward.concat(this.remoteAddr);
        }

        this.forwardHeader = forward;
        
        if ( this.otcsTicket == null || this.otcsTicket.length() == 0 ){
        	
        	String cstoken = ResourcePath.getCSToken(request);
        	
        	if(cstoken != null)
        		this.otcsTicket = cstoken;
		}
        
        // We duplicate the user agent as CS sometimes alters its response based on the browser; in particular,
        // download filenames appear incorrectly in some browsers without this
		this.userAgent = request.getHeader(USER_AGENT_HEADER_NAME);

    }
}
