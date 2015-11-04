package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.ws.server.rest.RESTServlet;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RESTDownloadAction extends SuspendedAction {
    private final HTTPRequestManager serverConnection;
    private final AsyncContext async;
    private final String url;
    private final CSForwardHeaders headers;
    private final HttpServletResponse response;

    public RESTDownloadAction(HTTPRequestManager serverConnection, AsyncContext async,
                             CSForwardHeaders headers, String url) {
        this.serverConnection = serverConnection;
        this.async = async;
        this.response = (HttpServletResponse) async.getResponse();
        this.headers = headers;
        this.url = url;
    }

    @Override
    public void resume() {
        try {
            serverConnection.streamGetResponseWithHeaders(url, response, headers);
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
