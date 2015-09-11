package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.engine.core.SuspendedActionQueue;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.listeners.DownloadAction;
import com.opentext.ecm.otsync.listeners.UploadAction;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.otag.SettingsService;
import com.opentext.ecm.otsync.ws.ServletUtil;

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
            asyncRequest.setTimeout(settingsClient.getServlet3ContentTimeout());
            DownloadAction action = new DownloadAction(serverConnection, asyncRequest);

            // enqueue only downloads marked "auto", representing automatic file-sync;
            // others can run directly on this thread
            boolean auto = Boolean.parseBoolean(request.getParameter(Message.AUTO_MODE_KEY_NAME));
            sendDownload(action, auto);
        } else if (ServletUtil.isPost(request)) {
            AsyncContext asyncRequest = request.startAsync();
            asyncRequest.setTimeout(settingsClient.getServlet3ContentTimeout());

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
