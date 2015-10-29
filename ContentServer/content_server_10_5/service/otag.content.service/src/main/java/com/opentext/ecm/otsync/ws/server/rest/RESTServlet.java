package com.opentext.ecm.otsync.ws.server.rest;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath.Verb;
import com.opentext.ecm.otsync.ws.server.rest.resources.*;
import com.opentext.ecm.otsync.ws.server.rest.resources.approots.AppRoots;
import com.opentext.ecm.otsync.ws.server.rest.resources.node.Nodes;
import com.opentext.ecm.otsync.ws.server.rest.resources.shares.Shares;
import com.opentext.ecm.otsync.ws.server.rest.resources.users.Users;
import com.opentext.ecm.otsync.ws.server.rest.resources.watches.Watches;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import java.io.IOException;

@MultipartConfig()
public class RESTServlet extends HttpServlet {

    public static Log log = LogFactory.getLog(RESTServlet.class);

    private class PathRoot extends ResourcePath {
        public PathRoot() {
            this.addSubPath(new Auth());
            this.addSubPath(new Nodes());
            this.addSubPath(new Shares());
            this.addSubPath(new Users());
            this.addSubPath(new Notifications());
            // TODO FIXME removed as it was used for completion of client wipe, to discuss
            //this.addSubPath(new Clients());
            this.addSubPath(new AppRoots());
            this.addSubPath(new Watches());
            this.addSubPath(new Events());
            this.addSubPath(new Settings());
            this.addSubPath(new Properties());
        }
    }

    private ResourcePath pathRoot = new PathRoot();

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doServiceStartedCheck();
        pathRoot.service(req, resp, getPathParts(req), Verb.GET, getVersion(req));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doServiceStartedCheck();
        pathRoot.service(req, resp, getPathParts(req), Verb.POST, getVersion(req));
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doServiceStartedCheck();
        pathRoot.service(req, resp, getPathParts(req), Verb.PUT, getVersion(req));
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doServiceStartedCheck();
        pathRoot.service(req, resp, getPathParts(req), Verb.DELETE, getVersion(req));
    }

    /**
     * Ensure we are ready to service request to Content Server.
     */
    private void doServiceStartedCheck() {
        if (!ContentServerService.isCsUrlDefined())
            throw new WebApplicationException("The Content Server URL setting has not been defined");
    }

    private String[] getPathParts(HttpServletRequest req) {
        // split the relative path into components, skipping the initial '/'
        return req.getPathInfo().substring(1).split("/");
    }

    private int getVersion(HttpServletRequest req) {
        return Integer.parseInt(req.getServletPath().substring(2));
    }
}
