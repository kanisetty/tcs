package com.opentext.otag.rest.util;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpMessage;

/**
 * ForwardHeaders allows headers from incoming
 * requests to be forwarded by subsequent requests.
 *
 * This also provides validation of headers such as
 * x-forwarded-for which will be set based on the IP of
 * the incoming request as OTAG is acting here
 * as an HTTP proxy.
 * 
 */
public class ForwardHeaders {

	private static final String IF_MODIFIED_SINCE = "If-Modified-Since";
	private static final String LANGUAGE_HEADER_KEY_NAME = "accept-language";
	private static final String USER_AGENT_HEADER_NAME = "user-agent";
	public final static String REQUEST_HEADER_KEY = "Request-Header-Helper";
	public final static String FORWARDED_FOR_HEADER_KEY_NAME = "X-Forwarded-For";

	private final String remoteAddr;
	private final String forwardHeader;
	private final String userAgent;
	private final String lang;
	private final String ifModifiedSince;
	private String uri;
    
    private Map<String,String> otherHeaders = new HashMap<>();

	public ForwardHeaders(final HttpServletRequest request){

		this.remoteAddr = request.getRemoteAddr();
		this.lang = request.getHeader(LANGUAGE_HEADER_KEY_NAME);
		this.ifModifiedSince = request.getHeader(IF_MODIFIED_SINCE);
		this.uri = request.getRequestURI();

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
        
        if(declaredUserAgent != null && declaredUserAgent.contains("Chrome/")){
        	this.userAgent = null;
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
    
    public String getRequestUri(){
    	return this.uri;
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

        for (Map.Entry<String, String> entry : otherHeaders.entrySet()) {
            request.addHeader(entry.getKey(), entry.getValue());
        }
        
        return;
    }

    public void addHeader(String name, String value) {
        otherHeaders.put(name, value);
    }
    
}
