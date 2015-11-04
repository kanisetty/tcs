package com.opentext.ecm.otsync.ws.server;

import com.opentext.ecm.otsync.http.ContentServerURL;
import com.opentext.ecm.otsync.listeners.ChunkedContentRequestQueue;
import com.opentext.ecm.otsync.ws.ServletUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.opentext.ecm.otsync.ContentServiceConstants.*;

public class AbstractChunkedContentChannel extends AbstractDownloadChannel {

    protected static Log log = LogFactory.getLog(Class.class);

    protected final ChunkedContentRequestQueue _queue;
    private static final String INVALID_PARAMETER_ERROR_MSG = "The url parameter was invalid";

    public AbstractChunkedContentChannel(final ChunkedContentRequestQueue queue) {
        _queue = queue;
    }

    protected void chunkedDownload(final HttpServletRequest request, final HttpServletResponse response) {
        String url = request.getParameter(CONTENT_URL_PARAMETER_NAME);
        ContentServerURL csURL = new ContentServerURL(url);

        // if there's no url given, check for an object id
        if (url == null || url.equals("")) {
            url = ServletUtil.getDownloadUrlForID(
                    request.getParameter(CONTENT_NODEID_PARAMETER_NAME),
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
            ServletUtil.error(response, ChunkedContentRequestQueue.MISSING_PARAMETER_ERROR_MSG,
                    HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        log.info("Downloading chunk of " + url);

        _queue.downloadFile(request, response, url);
    }

    public static void closeResponse(HttpServletResponse response) {
        try {
            response.getOutputStream().close();
        } catch (IOException e) {
            log.info("Error closing chunked content channel response", e);
        }
    }

}