package com.opentext.otsync.dcs.cs;

import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.dcs.appworks.ContentServerURLProvider;
import com.opentext.otsync.dcs.appworks.ServiceIndex;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;

public class CSRequestBuilder {

    private List<NameValuePair> params = new ArrayList<>();
    private String func;
    private CSForwardHeaders header;

    private ContentServerURLProvider urlProvider;

    public CSRequestBuilder(CSForwardHeaders headers) {
        this.header = headers;
    }

    public CSRequestBuilder func(String function) {
        this.func = function;
        return this;
    }

    public CSRequestBuilder para(String key, String value) {
        this.params.add(new BasicNameValuePair(key, value));
        return this;
    }

    public CSRequest build() {
        if (urlProvider == null)
            urlProvider = ServiceIndex.getCSUrlProvider();

        return new CSRequest(
                urlProvider.getContentServerUrl(),
                this.func, this.params, header);
    }
}
