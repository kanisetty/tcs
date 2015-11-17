package com.opentext.otsync.content.ws.server.servlet3;

import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.ws.message.MessageConverter;
import com.opentext.otsync.content.ws.server.ResponseHandler;
import com.opentext.otsync.content.ws.ServletUtil;

import javax.servlet.AsyncContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Servlet3ResponseHandler implements ResponseHandler {

    private final MessageConverter _messageConverter;
    private final AsyncContext _asyncRequest;
    private final Map<String, Object> _extraData;

    public Servlet3ResponseHandler(AsyncContext asyncRequest,
                                   MessageConverter messageConverter,
                                   Map<String, Object> extraData) {
        _asyncRequest = asyncRequest;
        _messageConverter = messageConverter;
        _extraData = extraData;
    }

    @SuppressWarnings("unchecked")
    public void send(Map<String, Object> responseData) throws IOException {
        Map<String, Object> responseDataShallowCopy;

        if (responseData != null) {

            // make a shallow copy of the responseData, so when we modify it we dont affect other
            // client's messages. This is only a shallow copy though, so do not modify anything off
            // the top level (ie. the info part of the response)
            responseDataShallowCopy = (Map<String, Object>) ((HashMap<String, Object>) responseData).clone();

            addExtraData(responseDataShallowCopy);

            fixV1BackchannelFields(responseDataShallowCopy);

            String responseString = _messageConverter.getSerializer().serialize(responseDataShallowCopy);

            // If present add the authentication tokens as Cookies on the response
            HttpServletResponse response = (HttpServletResponse) _asyncRequest.getResponse();
            String authToken = (String) responseData.get(ContentServiceConstants.CS_AUTH_TOKEN);
            String otagToken = (String) responseData.get("token");

            if (authToken != null){
                Cookie authCookie = new Cookie(ContentServiceConstants.CS_COOKIE_NAME, authToken);
                authCookie.setHttpOnly(true);
                authCookie.setPath("/");
                response.addCookie(authCookie);
                responseData.remove(ContentServiceConstants.CS_AUTH_TOKEN);
            }

            if (otagToken != null){
                Cookie authCookie = new Cookie(ContentServiceConstants.OTAG_TOKEN, otagToken);
                authCookie.setHttpOnly(true);
                authCookie.setPath("/");
                response.addCookie(authCookie);
                responseData.remove(ContentServiceConstants.OTAG_TOKEN);
            }

            ServletUtil.write(response, responseString);
            _asyncRequest.complete();
        } else {
            // send non-JSON terminal failure
            ServletUtil.write((HttpServletResponse) _asyncRequest.getResponse(), "upstream timeout");
            _asyncRequest.complete();
        }
    }

    private void addExtraData(Map<String, Object> responseData) {
        if (_extraData != null) {
            responseData.putAll(_extraData);
        }
    }

    private void fixV1BackchannelFields(Map<String, Object> responseData) {
        HttpServletRequest req = (HttpServletRequest) _asyncRequest.getRequest();
        String url = req.getRequestURL().toString();

        if (url.toLowerCase().contains("/backchannel")) {
            responseData.remove("id");
        }
    }

    public void error(String msg) {
        ServletUtil.error((HttpServletResponse) _asyncRequest.getResponse(), msg,
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        _asyncRequest.complete();
    }


    public void close() throws IOException {
        _asyncRequest.getResponse().getOutputStream().close();
        _asyncRequest.complete();
    }

}
