package com.opentext.otsync.dcs;

import com.opentext.otsync.rest.util.CSForwardHeaders;

public class CSRequestBuilderFactory {
    private CSForwardHeaders forwardHeader;

    public CSRequestBuilderFactory(CSForwardHeaders forwardHeader) {
        this.forwardHeader = forwardHeader;
    }

    public CSRequestBuilder newBuilder() {
        return new CSRequestBuilder(forwardHeader);
    }
}
