package com.opentext.ecm.otsync.ws.server.rest;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.opentext.ecm.otsync.ws.server.rest.ResourcePath.Verb;

@MultipartConfig()
@SuppressWarnings("serial")
public class RESTServlet extends HttpServlet {
	
	public static Log log = LogFactory.getLog(RESTServlet.class);
	
	private class PathRoot extends ResourcePath{
		public PathRoot() {
			this.addSubPath(new Auth());
			this.addSubPath(new Nodes());
			this.addSubPath(new Shares());
			this.addSubPath(new Users());
			this.addSubPath(new Notifications());
			this.addSubPath(new Clients());
			this.addSubPath(new Settings());
			this.addSubPath(new AppRoots());
			this.addSubPath(new Properties());
			this.addSubPath(new Watches());
			this.addSubPath(new Events());
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
		pathRoot.service(req, resp, getPathParts(req), Verb.GET, getVersion(req)); 
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		pathRoot.service(req, resp, getPathParts(req), Verb.POST, getVersion(req));
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		pathRoot.service(req, resp, getPathParts(req), Verb.PUT, getVersion(req)); 
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		pathRoot.service(req, resp, getPathParts(req), Verb.DELETE, getVersion(req)); 
	}

	private String[] getPathParts(HttpServletRequest req) {
		// split the relative path into components, skipping the initial '/'
		String[] pathParts = req.getPathInfo().substring(1).split("/");
		
		return pathParts;
	}
	
	private int getVersion(HttpServletRequest req) {
		return Integer.parseInt(req.getServletPath().substring(2));
	}
}
