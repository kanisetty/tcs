package com.opentext.otsync.content.util;

import org.apache.http.Header;
import org.apache.http.HttpResponse;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * ReturnHeaders stores a list of HTTP Headers retrieved from an HTTP Response and adds them to an outgoing response
 *
 * The purpose of this class is to allow the forwarding of headers, primarily Set-Cookie, from one or more internal
 * requests out to a single incoming client request.
 *
 * An example of this is Authentication. Internally we need to authenticate against AppWorks and Content Server, the
 * resulting response to the client should include all Set-Cookie headers received from both of those systems.
 */
public class ReturnHeaders {
    public static final String MAP_KEY = "returnHeaders";

    private List<Header> headerList = new ArrayList<>();
    private static final String[] NAME_WHITELIST = {"Set-Cookie"};

    public ReturnHeaders() {
    }

    public void extractHeaders(HttpResponse response) {
        for (Header head : response.getAllHeaders()) {
            headerList.add(head);
        }
    }

    public void addToResponse(HttpServletResponse response) {
        for (Header head : headerList) {
            if (validHeader(head)) {
                response.addHeader(head.getName(), head.getValue());
            }
        }
    }

    /**
     * Only allow approved headers to be returned to the client
     * The approved list for now is only Set-Cookie headers so that session tokens can remain active
     * @param head - current header to be validated
     * @return
     */
    private boolean validHeader(Header head){
        for (String s : NAME_WHITELIST){
            if (head.getName().toLowerCase().contains(s.toLowerCase())){
                return true;
            }
        }
        return false;
    }

}
