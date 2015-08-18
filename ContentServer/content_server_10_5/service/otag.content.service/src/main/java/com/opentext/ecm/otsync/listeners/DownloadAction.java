package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.ContentServerURL;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.AbstractDownloadChannel;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DownloadAction extends SuspendedAction {

    private HTTPRequestManager contentServerConnection;
    private AsyncContext async;
    private static final String NO_RESPONSE_ERROR_MSG = "Could not get response";
    private static final String MISSING_PARAMETER_ERROR_MSG = "either url or nodeID parameter is required";
    private static final String INVALID_PARAMETER_ERROR_MSG = "The url parameter was invalid";

    public DownloadAction(HTTPRequestManager contentServerConnection, AsyncContext async) {
        this.contentServerConnection = contentServerConnection;
        this.async = async;
    }

    @Override
    public void resume() {
        pipeDownload((HttpServletRequest) async.getRequest(), (HttpServletResponse) async.getResponse());
        async.complete();
    }

    private void pipeDownload(final HttpServletRequest request, final HttpServletResponse response) {
        String url = request.getParameter(ServletConfig.getContentUrlParameterName());
        final String llcookie = AbstractDownloadChannel.getLLCookieFromRequest(request);
        final RequestHeader headers = new RequestHeader(request, llcookie);
        ContentServerURL csURL = new ContentServerURL(url);

        // if there's no url given, check for an ojbect id
        if (url == null || url.equals("")) {
            url = ServletUtil.getDownloadUrlForID(request.getParameter(ServletConfig.getContentNodeIDParameterName()),
                    request.getParameter(ServletConfig.getContentVersionNumParameterName()));
        } else {
            // the URL has to be checked to ensure that it is not a malicious request
            if (csURL.isValid()) {
                url = csURL.getURL();
            } else {
                ServletUtil.error(response, INVALID_PARAMETER_ERROR_MSG, HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
        }

        // if we have been unable to figure out what to download, return an error
        if (url == null || url.equals("")) {
            ServletUtil.error(response, MISSING_PARAMETER_ERROR_MSG, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try {

            AbstractDownloadChannel.log.info("Downloading " + url);

            if (llcookie != null) {
                contentServerConnection.streamGetResponseWithUserCookie(url, response,
                        AbstractDownloadChannel.CS_COOKIE_NAME, llcookie, headers);
            } else {
                contentServerConnection.streamGetResponse(url, response);
            }

        } catch (IOException e) {
            ServletUtil.error(response, NO_RESPONSE_ERROR_MSG, HttpServletResponse.SC_NO_CONTENT);
        }
    }

    @Override
    public String logType() {
        return "download";
    }

}
