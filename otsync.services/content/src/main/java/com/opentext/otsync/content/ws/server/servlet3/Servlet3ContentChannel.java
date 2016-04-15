package com.opentext.otsync.content.ws.server.servlet3;

import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.content.engine.core.SuspendedAction;
import com.opentext.otsync.content.engine.core.SuspendedActionQueue;
import com.opentext.otsync.content.http.HTTPRequestManager;
import com.opentext.otsync.content.listeners.DownloadAction;
import com.opentext.otsync.content.listeners.UploadAction;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.otag.SettingsService;
import com.opentext.otsync.content.ws.ServletUtil;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Servlet3ContentChannel {

    private final HTTPRequestManager serverConnection;
    private final SuspendedActionQueue sharedThreadPool;
    private final SettingsService settingsClient;

    public Servlet3ContentChannel(HTTPRequestManager serverConnection,
                                  SuspendedActionQueue sharedThreadPool,
                                  SettingsService settingsClient) {
        this.sharedThreadPool = sharedThreadPool;
        this.serverConnection = serverConnection;
        this.settingsClient = settingsClient;
    }

    public void handle(HttpServletRequest request, HttpServletResponse response) {
        if (ServletUtil.isGet(request)) {
            AsyncContext asyncRequest = request.startAsync();
            try {
                asyncRequest.setTimeout(settingsClient.getServlet3ContentTimeout());
            } catch (APIException e) {
                throw new RuntimeException("Failed to get content timeout setting from the Gateway", e);
            }
            DownloadAction action = new DownloadAction(serverConnection, asyncRequest);

            // enqueue only downloads marked "auto", representing automatic file-sync;
            // others can run directly on this thread
            boolean auto = Boolean.parseBoolean(request.getParameter(Message.AUTO_MODE_KEY_NAME));
            sendDownload(action, auto);
        } else if (ServletUtil.isPost(request)) {
            AsyncContext asyncRequest = request.startAsync();
            try {
                asyncRequest.setTimeout(settingsClient.getServlet3ContentTimeout());
            } catch (APIException e) {
                throw new RuntimeException("Failed to get content timeout setting from the Gateway", e);
            }

            UploadAction action = new UploadAction(serverConnection, asyncRequest);
            sendUpload(action);
        } else {
            ServletUtil.error(response, "Method must be GET or POST", HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        }
    }

    public void sendDownload(SuspendedAction action, boolean enqueue) {
        if (enqueue) {
            sharedThreadPool.send(action);
        } else {
            sharedThreadPool.sendImmediately(action);
        }
    }

    public void sendUpload(SuspendedAction action) {
        sharedThreadPool.sendImmediately(action);
    }
}
