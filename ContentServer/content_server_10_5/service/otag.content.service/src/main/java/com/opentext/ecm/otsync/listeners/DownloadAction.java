package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.ContentServerURL;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.AbstractDownloadChannel;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.opentext.ecm.otsync.ContentServiceConstants.*;

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
        String url = request.getParameter(CONTENT_URL_PARAMETER_NAME);
        ContentServerURL csURL = new ContentServerURL(url);

        // if there's no url given, check for an ojbect id
        if (url == null || url.equals("")) {
            url = ServletUtil.getDownloadUrlForID(request.getParameter(CONTENT_NODEID_PARAMETER_NAME),
                    request.getParameter(CONTENT_VERNUM_PARAMETER_NAME));
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
            contentServerConnection.streamGetResponseWithHeaders(url, response, new CSForwardHeaders(request));
        } catch (IOException e) {

            ServletUtil.error(response, NO_RESPONSE_ERROR_MSG, HttpServletResponse.SC_NO_CONTENT);
        }
    }

    @Override
    public String logType() {
        return "download";
    }

}
