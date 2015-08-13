package com.opentext.ecm.otsync.ws.server;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.ServletUtil;

public class AbstractDownloadChannel {

	// TODO FIXME :( LLCOOKIE
	public static final String CS_COOKIE_NAME = "LLCookie";
	public static final Log log = LogFactory.getLog(AbstractDownloadChannel.class);

	public static String getLLCookieFromRequest(HttpServletRequest request) {
		String llcookie = "";
		try {
			String cookie = ServletUtil.getCookie(request, CS_COOKIE_NAME);
			if(cookie != null){
				llcookie = URLEncoder.encode(cookie, ServletConfig.CHAR_ENCODING);
			}
		} catch (UnsupportedEncodingException e) {
			log.error("couldn't get llcookie", e);
		}
		
		return llcookie;
	}

}