package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.otag.SettingsService;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.http.HTTPRequestManager.ResponseWithStatus;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.servlet3.Servlet3BackChannel;
import com.opentext.ecm.otsync.ws.server.servlet3.Servlet3ChunkedContentChannel;
import com.opentext.ecm.otsync.ws.server.servlet3.Servlet3ContentChannel;
import com.opentext.ecm.otsync.ws.server.servlet3.Servlet3FrontChannel;
import org.apache.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ResourcePath {

    private static final String TOKEN_COOKIE = "otagtoken";
    private static final String TOKEN_PARAM = "token";
    protected static final String LL_COOKIE_NAME = "LLCookie";
    public static final String CSTOKEN = "cstoken";
    private int pathIndex = 0;
    final private List<ResourcePath> subPaths = new ArrayList<>();

    enum Verb {GET, POST, PUT, DELETE}

    public void addSubPath(ResourcePath subPath) {
        subPath.setPathIndex(pathIndex + 1);
        subPaths.add(subPath);
    }

    public void service(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, Verb verb, int version) {
        if (pathParams.length > pathIndex) {
            // find handler for next path part: must be an exact case-insensitive match or
            // a null path, i.e. a variable path component
            String path = pathParams[pathIndex];
            ResourcePath selectedPath = null;
            ResourcePath potentialPath = null;
            for (ResourcePath subPath : subPaths) {
                if (subPath.getPath() == null) {
                    potentialPath = subPath;
                    continue;
                }

                if (subPath.getPath().equalsIgnoreCase(path)) {
                    selectedPath = subPath;
                    break;
                }
            }

            if (selectedPath == null && potentialPath != null) {
                selectedPath = potentialPath;
            }

            if (selectedPath != null) {
                selectedPath.service(req, resp, pathParams, verb, version);
            } else {
                rejectResource(resp);
            }
        } else {
            // this is the handler for this resource path; handle accordingly
            switch (verb) {
                case GET:
                    doGet(req, resp, pathParams, version);
                    break;
                case POST:
                    doPost(req, resp, pathParams, version);
                    break;
                case PUT:
                    doPut(req, resp, pathParams, version);
                    break;
                case DELETE:
                    doDelete(req, resp, pathParams, version);
                    break;
            }
        }
    }

    final protected int getPathIndex() {
        return pathIndex;
    }

    // Provide access to the central Engine's channels and resources

    protected Servlet3FrontChannel getFrontChannel() {
        return ContentServerService.getEngine().getFrontChannel();
    }

    protected Servlet3BackChannel getBackChannel() {
        return ContentServerService.getEngine().getBackChannel();
    }

    public Servlet3ChunkedContentChannel getChunkedContentChannel() {
        return ContentServerService.getEngine().getChunkedContentChannel();
    }

    public Servlet3ContentChannel getContentChannel() {
        return ContentServerService.getEngine().getContentChannel();
    }

    public SettingsService getSettingsService() {
        return ContentServerService.getSettingsService();
    }

    public HTTPRequestManager getServerConnection() {
        return ContentServerService.getHttpManager();
    }

    //
    // Subclasses should override these protected methods for each verb applicable to the resource
    //
    protected String getPath() {
        return null;
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        rejectHttpMethod(resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        rejectHttpMethod(resp);
    }

    protected void doPut(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        rejectHttpMethod(resp);
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse resp, String[] pathParams, int version) {
        rejectHttpMethod(resp);
    }

    private void rejectHttpMethod(HttpServletResponse resp) {
        try {
            resp.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        } catch (IOException ignored) {
        }
    }

    public static String getCSToken(HttpServletRequest req) {
        String cstoken = req.getParameter(CSTOKEN);
        if (cstoken == null) {
            cstoken = ServletUtil.getCookie(req, LL_COOKIE_NAME);
        }
        return cstoken;
    }

    public static String getToken(HttpServletRequest req) {
        String token = req.getParameter(TOKEN_PARAM);
        if (token == null) {
            token = ServletUtil.getCookie(req, TOKEN_COOKIE);
        }
        return token;
    }

    public static void rejectResource(HttpServletResponse resp) {
        try {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (IOException ignored) {
        }
    }

    public static void rejectRequest(HttpServletResponse resp) {
        try {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        } catch (IOException ignored) {
        }
    }

    public static void rejectAuth(HttpServletResponse resp) {
        try {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (IOException ignored) {
        }
    }

    public static void sendInternalError(HttpServletResponse resp) {
        try {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (IOException ignored) {
        }
    }

    private void setPathIndex(int i) {
        pathIndex = i;
        for (ResourcePath subPath : subPaths) {
            subPath.setPathIndex(i + 1);
        }
    }

    public static boolean doAdminApiPost(HttpServletResponse resp, String cookie, RequestHeader headers,
                                         Map<String, String> params, boolean forwardResponse) {
        boolean success = false;
        try {
            HTTPRequestManager requestManager = ContentServerService.getHttpManager();
            if (requestManager != null) {
                ResponseWithStatus response = requestManager.post(ContentServerService.getCsUrl(),
                        params, LL_COOKIE_NAME, cookie, headers);

                int statusCode = response.status.getStatusCode();
                if (statusCode == HttpStatus.SC_OK) {

                    if (forwardResponse) {
                        ServletUtil.write(resp, response.response);
                    } else {
                        resp.getOutputStream().close();
                    }

                    success = true;
                } else if (statusCode == HttpStatus.SC_MOVED_TEMPORARILY) {
                    // 302 happens when CS10 tries to redirect us to a login page, i.e. the cstoken isn't good
                    rejectAuth(resp);
                } else {
                    resp.sendError(statusCode, response.status.getReasonPhrase());
                }
            } else {
                RESTServlet.log.warn("Error forwarding admin request, HTTP client not initialised yet");
                sendInternalError(resp);
            }

        } catch (IOException e) {
            RESTServlet.log.warn("Error forwarding admin request", e);
            sendInternalError(resp);
        }

        return success;
    }
}