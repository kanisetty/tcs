package com.opentext.otsync.rest.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.http.impl.cookie.BasicClientCookie;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


public class CSForwardHeaders extends ForwardHeaders {
    private LLCookie llCookie;

    @JsonCreator
    public CSForwardHeaders(@JsonProperty("remoteAddr") String remoteAddr,
                            @JsonProperty("forwardHeader") String forwardHeader,
                            @JsonProperty("userAgent") String userAgent,
                            @JsonProperty("lang") String lang,
                            @JsonProperty("ifModifiedSince") String ifModifiedSince,
                            @JsonProperty("uri") String uri,
                            @JsonProperty("otherHeaders") Map<String, String> otherHeaders) {

        super(remoteAddr, forwardHeader, userAgent, lang,  ifModifiedSince,  uri, otherHeaders);
    }
    public CSForwardHeaders(HttpServletRequest request) {
        super(request);

        llCookie = new LLCookie(request);
    }

    public LLCookie getLLCookie(){
        return llCookie;
    }
}
