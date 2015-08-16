package com.opentext.otag.cs.dcs;

import com.opentext.otag.rest.util.ForwardHeaders;

public class CSRequestBuilderFactory {
    private String csToken;
    private ForwardHeaders forwardHeader;

    public CSRequestBuilderFactory(String cstoken, ForwardHeaders forwardHeader) {
        this.csToken = cstoken;
        this.forwardHeader = forwardHeader;
    }

    public CSRequestBuilder newBuilder() {
        return new CSRequestBuilder(csToken, forwardHeader);
    }
}
