package com.opentext.ecm.otsync.ws.server.rest.resources;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.rest.resources.approots.AdminAPI;

public class Settings extends ResourcePath {

	@Override
	protected String getPath() {
		return "settings";
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String cookie = getCSToken(req);
		
		RequestHeader headers = new RequestHeader(req);
		
		Map<String, String> params = new HashMap<String, String>();
		params.put("func", "otsync.settings");
		
		doAdminApiPost(resp, cookie, headers, params, true); // true: return the response body
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		new AdminAPI("otsync.settings", req, resp).executeWithoutResponse();
		
	}
}
