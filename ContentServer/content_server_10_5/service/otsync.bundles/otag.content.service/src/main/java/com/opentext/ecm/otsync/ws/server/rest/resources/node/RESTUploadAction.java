package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import com.opentext.ecm.otsync.engine.ContentServiceEngine;
import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.ws.message.MessageConverter.Serializer;
import com.opentext.ecm.otsync.ws.server.rest.RESTServlet;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class RESTUploadAction extends SuspendedAction {

    private HTTPRequestManager serverConnection;
    private AsyncContext async;
    private HttpServletResponse resp;
    private CSForwardHeaders headers;
    private InputStream stream;
    private long fileSize;
    private String filename;
    private Map<String, String> params;
    public static final String PHOTO_UPLOAD_PART_NAME = "Photo";
    public static final String FILE_UPLOAD_PART_NAME = "versionFile";
    public static final String UPLOAD_PART_NAME = "file";
    private String filefieldname = "";

    public RESTUploadAction(HTTPRequestManager serverConnection,
                            AsyncContext async, CSForwardHeaders headers,
                            InputStream stream, long fileSize, String filename, String filefieldname,
                            Map<String, String> params) {
        this.serverConnection = serverConnection;
        this.async = async;
        this.resp = (HttpServletResponse) async.getResponse();
        this.headers = headers;
        this.stream = stream;
        this.fileSize = fileSize;
        this.filename = filename;
        this.filefieldname = filefieldname;
        this.params = params;
    }

    @Override
    public void resume() {
        try {
            serverConnection.forwardMultiPartPost( stream, params, filefieldname, filename, fileSize, headers, resp);
            async.complete();
        } catch (IOException e) {
            try {
                RESTServlet.log.error("Error while uploading file via REST api", e);
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                async.complete();
            } catch (IOException ignored) {
            }
        }
    }

    @Override
    public String logType() {
        return "upload (REST api)";
    }

    public static void uploadRequest(HttpServletRequest req,
                                     HttpServletResponse resp, HashMap<String, Object> payload,
                                     String fileFieldName) {
        try {
            Part filePart = req.getPart(UPLOAD_PART_NAME);

            if (filePart != null) {
                InputStream stream = filePart.getInputStream();

                long fileSize = filePart.getSize();

                String filename = getFilenameFromPart(filePart);

                if (filename != null) {
                    Message.infoPut(payload, Message.NAME_KEY_NAME, filename);

                    Serializer serializer = getEngine().getFrontChannel().getMessageConverter().getSerializer();
                    String payloadString = serializer.serialize(payload);

                    Map<String, String> params = new HashMap<>();
                    params.put(Message.PAYLOAD_KEY_NAME, payloadString);
                    params.put(Message.FUNC_KEY_NAME, Message.OTSYNC_FUNC_VALUE);

                    HTTPRequestManager serverConnection = getHttpManager();

                    AsyncContext asyncRequest = req.startAsync();
                    asyncRequest.setTimeout(ContentServerService.getSettingsService().getServlet3ContentTimeout());

                    SuspendedAction action = new RESTUploadAction(serverConnection, asyncRequest, new CSForwardHeaders(req),
                            stream, fileSize, filename, fileFieldName, params);
                    getEngine().getContentChannel().sendUpload(action);
                } else {
                    ResourcePath.rejectRequest(resp);
                }
            } else {
                ResourcePath.rejectRequest(resp);
            }

        } catch (IllegalStateException | IOException | ServletException e) {
            ResourcePath.sendInternalError(resp);
        }
    }

    private static ContentServiceEngine getEngine() {
        return ContentServerService.getEngine();
    }

    static public String getFilenameFromPart(Part filePart) {
        String filename = null;
        String[] contentDispositions = filePart.getHeader("content-disposition").split(";");
        for (String header : contentDispositions) {
            if (header.trim().startsWith("filename")) {
                filename = header.substring(header.indexOf('"') + 1, header.lastIndexOf('"'));
            }
        }
        return filename;
    }

    public static void uploadAdminAPIRequest(String func,
                                             Map<String, String> params, String fileFieldName,
                                             HttpServletRequest req, HttpServletResponse resp) {
        try {
            Part filePart = req.getPart(UPLOAD_PART_NAME);

            if (filePart != null) {
                InputStream stream = filePart.getInputStream();

                long fileSize = filePart.getSize();

                String filename = getFilenameFromPart(filePart);

                if (filename != null) {
                    params.put(Message.FUNC_KEY_NAME, func);

                    HTTPRequestManager serverConnection = getHttpManager();

                    serverConnection.forwardMultiPartPost( stream, params, fileFieldName, filename, fileSize, new CSForwardHeaders(req), resp );
                    resp.flushBuffer();
                    resp.getOutputStream().close();
                } else {
                    ResourcePath.rejectRequest(resp);
                }
            } else {
                ResourcePath.rejectRequest(resp);
            }
        } catch (IllegalStateException | ServletException | IOException e) {
            ResourcePath.sendInternalError(resp);
        }
    }

    private static HTTPRequestManager getHttpManager() {
        return ContentServerService.getHttpManager();
    }
}
