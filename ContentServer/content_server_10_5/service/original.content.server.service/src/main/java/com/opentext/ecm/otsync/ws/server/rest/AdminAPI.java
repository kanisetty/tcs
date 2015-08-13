package com.opentext.ecm.otsync.ws.server.rest;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;

public class AdminAPI {
	
	private final HttpServletResponse resp;
	private final RequestHeader headers;
	private final Map<String, String> params;
	private final String cstoken;
	
	public AdminAPI(String func, HttpServletRequest req, HttpServletResponse resp) {
		this.resp = resp;
		this.cstoken = ResourcePath.getCSToken(req);	
		this.headers = new RequestHeader(req);
		
		this.params = new HashMap<String, String>();
		sendAllParams(req, params);
		params.put(ResourcePath.CSTOKEN, cstoken);
		params.put("func", func);
	}
	
	public AdminAPI param(String key, String value){
		params.put(key, value);
		return this;
	}
	
	public boolean executeWithResponse(){
		return ResourcePath.doAdminApiPost(resp, cstoken, headers, params, true);
	}
	
	public boolean executeWithoutResponse(){
		return ResourcePath.doAdminApiPost(resp, cstoken, headers, params, false);
	}

	private void sendAllParams(HttpServletRequest req, Map<String, String> params) {
		Enumeration<String> reqParams = req.getParameterNames();
		while(reqParams.hasMoreElements()){
			String param = reqParams.nextElement();
			if(!Message.CSTOKEN_KEY_NAME.equals(param)){
				params.put(param, req.getParameter(param));
			}
		}
	}
}
