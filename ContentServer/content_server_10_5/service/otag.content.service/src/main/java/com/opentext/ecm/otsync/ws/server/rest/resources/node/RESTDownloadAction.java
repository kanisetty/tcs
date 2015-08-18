package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.ws.server.AbstractDownloadChannel;
import com.opentext.ecm.otsync.ws.server.rest.RESTServlet;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RESTDownloadAction extends SuspendedAction {
    private final HTTPRequestManager serverConnection;
    private final AsyncContext async;
    private final String url;
    private final RequestHeader headers;
    private final HttpServletResponse response;
    private final String llcookie;

    public RESTDownloadAction(HTTPRequestManager serverConnection, AsyncContext async,
                              RequestHeader headers, String url, String llcookie) {
        this.serverConnection = serverConnection;
        this.async = async;
        this.response = (HttpServletResponse) async.getResponse();
        this.headers = headers;
        this.url = url;
        this.llcookie = llcookie;
    }

    @Override
    public void resume() {
        try {
            serverConnection.streamGetResponseWithUserCookie(url, response,
                    AbstractDownloadChannel.CS_COOKIE_NAME, llcookie, headers);
            async.complete();
        } catch (IOException e) {
            try {
                RESTServlet.log.error("Error getting download from Content Server for " + url);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                async.complete();
            } catch (IOException ignored) {
            }
        }
    }

    @Override
    public String logType() {
        return "download (REST api)";
    }

}
