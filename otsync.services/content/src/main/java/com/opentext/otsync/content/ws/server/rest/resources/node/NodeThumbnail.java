package com.opentext.otsync.content.ws.server.rest.resources.node;

import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.content.engine.core.SuspendedAction;
import com.opentext.otsync.content.http.HTTPRequestManager;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.otag.ContentServerService;
import com.opentext.otsync.content.ws.server.rest.AdminAPI;
import com.opentext.otsync.content.ws.server.rest.ResourcePath;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

public class NodeThumbnail extends ResourcePath {

    public final Log log = LogFactory.getLog(NodeThumbnail.class);

    @Override
    protected String getPath() {
        return "thumbnail";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);

        downloadThumbnail(req, node, resp);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp,
                         String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);

        setThumbnail(node, req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp,
                            String[] pathParams, int version) {
        String node = NodeID.getNodeID(pathParams);

        deleteThumbnail(node, req, resp);
    }

    private void downloadThumbnail(HttpServletRequest req, String nodeID, HttpServletResponse resp) {
        String otcsticket = getOTCSTicket(req);
        String allowDefault = req.getParameter(Message.ALLOW_DEFAULT);
        String type = req.getParameter(Message.TYPE);

        if (otcsticket != null) {
            String url = new StringBuilder()
                    .append(ContentServerService.getCsUrl())
                    .append("?func=otsync.GetNodeThumbnail&nodeID=")
                    .append(nodeID)
                    .append("&type=")
                    .append(type)
                    .append("&allowDefault=")
                    .append(allowDefault)
                    .toString();

            AsyncContext asyncRequest = req.startAsync();
            try {
                asyncRequest.setTimeout(getSettingsService().getServlet3RequestTimeout());
            } catch (APIException e) {
                log.error("Failed to resolve the request timeout setting - " + e.getCallInfo());
                rejectRequest(resp);
                return;
            }

            HTTPRequestManager serverConnection = getServerConnection();

            SuspendedAction action = new RESTDownloadAction(serverConnection, asyncRequest, new CSForwardHeaders(req), url);

            getContentChannel().sendDownload(action, false);
        } else {
            rejectRequest(resp);
        }

    }

    private void setThumbnail(String node, HttpServletRequest req, HttpServletResponse resp) {
        HashMap<String, String> params = new HashMap<String, String>();
        params.put("nodeID", node);

        RESTUploadAction.uploadAdminAPIRequest(Message.SET_THUMBNAIL_FUNC, params, "thumbnail", req, resp);
    }

    private void deleteThumbnail(String node, HttpServletRequest req,
                                 HttpServletResponse resp) {
        new AdminAPI(Message.DELETE_THUMBNAIL_FUNC, req, resp)
                .param("nodeID", node)
                .executeWithResponse();
    }

}
