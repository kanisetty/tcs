package com.opentext.ecm.otsync.ws.server;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.ws.ServletUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class AbstractDownloadChannel {

    public static final Log log = LogFactory.getLog(AbstractDownloadChannel.class);

    public static String getLLCookieFromRequest(HttpServletRequest request) {
        String llcookie = "";
        try {
            String cookie = ServletUtil.getCookie(request, ContentServiceConstants.CS_COOKIE_NAME);
            if (cookie != null) {
                llcookie = URLEncoder.encode(cookie, ContentServiceConstants.CHAR_ENCODING);
            }
        } catch (UnsupportedEncodingException e) {
            log.error("couldn't get llcookie", e);
        }

        return llcookie;
    }

}