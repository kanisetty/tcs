package com.opentext.otag.cs.dcs;

import com.opentext.otag.rest.util.CSForwardHeaders;

public class CSRequestBuilderFactory {
    private CSForwardHeaders forwardHeader;

    public CSRequestBuilderFactory(CSForwardHeaders forwardHeader) {
        this.forwardHeader = forwardHeader;
    }

    public CSRequestBuilder newBuilder() {
        return new CSRequestBuilder(forwardHeader);
    }
}
