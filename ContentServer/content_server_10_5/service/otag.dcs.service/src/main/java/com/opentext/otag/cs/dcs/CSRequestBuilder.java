package com.opentext.otag.cs.dcs;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;

public class CSRequestBuilder {
    private List<NameValuePair> params = new ArrayList<>();
    private String func;
    private String csToken;
    private ForwardHeaders header;

    public CSRequestBuilder(String csToken, ForwardHeaders headers) {
        this.csToken = csToken;
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
        return new CSRequest(DocumentConversionService.getCsUrl(),
                this.func, this.csToken, this.params, header);
    }
}
