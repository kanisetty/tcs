package com.opentext.otag.rest.util;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.opentext.otag.api.shared.util.ForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by mjohnsto on 10/20/2015.
 */
public class CSForwardHeaders extends ForwardHeaders {
    public static final String OTCSTICKET_HEADER_NAME = "OTCSTICKET";
    public final static String REQUEST_HEADER_KEY = "Request-Header-Helper";

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

        this.addHeader(OTCSTICKET_HEADER_NAME, request.getHeader(OTCSTICKET_HEADER_NAME));
    }



}
