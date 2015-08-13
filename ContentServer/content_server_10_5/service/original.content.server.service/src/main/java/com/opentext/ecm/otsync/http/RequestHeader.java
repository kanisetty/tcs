package com.opentext.ecm.otsync.http;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpMessage;

import com.opentext.ecm.otsync.ws.ServletConfig;

/**
 * RequestHeader encapsulates header values that will be required
 * for future requests. The initial purpose is to allow headers from incoming
 * requests to be forwarded by subsequent requests.
 *
 * This also provides validation of headers such as
 * x-forwarded-for which will be set based on the IP of
 * the incoming request as the OTSync engine is acting here
 * as an HTTP proxy.
 * 
 */
public class RequestHeader {

	private static final String IF_MODIFIED_SINCE = "If-Modified-Since";
	private static final String LANGUAGE_HEADER_KEY_NAME = "accept-language";
	private static final String USER_AGENT_HEADER_NAME = "user-agent";
	public final static String REQUEST_HEADER_KEY = "Request-Header-Helper";
	public final static String FORWARDED_FOR_HEADER_KEY_NAME = "X-Forwarded-For";
	private static final String HTTP_REFERER_HEADER = "REFERER";

	private final String remoteAddr;
	private final String forwardHeader;
	private final String userAgent;
	private final String lang;
	private final String ifModifiedSince;

	public RequestHeader(final HttpServletRequest request){

		this.remoteAddr = request.getRemoteAddr();
		this.lang = request.getHeader(LANGUAGE_HEADER_KEY_NAME);
		this.ifModifiedSince = request.getHeader(IF_MODIFIED_SINCE);

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
        
        // We duplicate the user agent as CS sometimes alters its response based on the browser; in particular,
        // download filenames appear incorrectly in some browsers without this
        String declaredUserAgent = request.getHeader(USER_AGENT_HEADER_NAME);
        
        // if the user-agent is Chrome, forward depending on config setting to work around CS bug
        if(!ServletConfig.shouldForwardChromeUserAgent()){
            if(declaredUserAgent != null && declaredUserAgent.contains("Chrome/")){
            	this.userAgent = null;
            }
            else {
            	this.userAgent = declaredUserAgent;
            }
        }
        else {
        	this.userAgent = declaredUserAgent;
        }
    }

    public String getForwardHeader(){

        return this.forwardHeader;
    }

    public String getRemoteAddr(){

        return this.remoteAddr;
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
        request.addHeader(HTTP_REFERER_HEADER, ServletConfig.getContentServerUrl());

        return;
    }

}
