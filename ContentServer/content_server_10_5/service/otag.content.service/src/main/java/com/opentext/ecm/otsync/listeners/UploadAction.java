package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.ContentServerService;
import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.ws.ServletUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UploadAction extends SuspendedAction {

    protected static Log log = LogFactory.getLog(Class.class);

    private static final String COULD_NOT_SEND_UPLOAD_REQUEST_ERROR_MSG = "Could not send upload request to server";

    protected final HTTPRequestManager contentServerConnection;
    private AsyncContext async;

    public UploadAction(HTTPRequestManager contentServerConnection, AsyncContext async) {
        this.contentServerConnection = contentServerConnection;
        this.async = async;
    }

    @Override
    public void resume() {
        passThroughUpload((HttpServletRequest) async.getRequest(), (HttpServletResponse) async.getResponse());
        async.complete();
    }

    private void passThroughUpload(final HttpServletRequest request, final HttpServletResponse response) {
        try {
            log.info("Uploading file");
            contentServerConnection.forwardPostRequest(ContentServerService.getCsUrl(), request, response);

        } catch (IOException e) {
            log.warn(e);
            ServletUtil.error(response, COULD_NOT_SEND_UPLOAD_REQUEST_ERROR_MSG,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public String logType() {
        return "upload";
    }

}
