package com.opentext.ecm.otsync.ws.server.rest.resources.node;

import java.io.IOException;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletResponse;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.http.ContentServiceHttpClient;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.ws.server.AbstractDownloadChannel;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class RESTDownloadAction extends SuspendedAction {
	private static final Log log = LogFactory.getLog(RESTDownloadAction.class);

	private final ContentServiceHttpClient serverConnection;
	private final AsyncContext async;
	private final String url;
	private final RequestHeader headers;
	private final HttpServletResponse response;
	private final String llcookie;
	
	public RESTDownloadAction(ContentServiceHttpClient serverConnection, AsyncContext async, RequestHeader headers, String url, String llcookie) {
		this.serverConnection = serverConnection;
		this.async = async;
		this.response = (HttpServletResponse) async.getResponse();
		this.headers = headers;
		this.url = url;
		this.llcookie = llcookie;
	}

	@Override
	public void resume() {
		try{
			serverConnection.streamGetResponseWithUserCookie(url, response, AbstractDownloadChannel.CS_COOKIE_NAME, llcookie, headers);
			async.complete();
		}
		catch ( IOException e ){
			try {
				log.error("Error getting download from Content Server for " + url);
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				async.complete();
			} catch (IOException e1) {
			}
		}
	}

	@Override
	public String logType() {
		return "download (REST api)";
	}

}
