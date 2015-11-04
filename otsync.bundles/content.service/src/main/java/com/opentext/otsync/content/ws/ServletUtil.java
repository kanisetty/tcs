package com.opentext.otsync.content.ws;

import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.otag.ContentServerService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.NumberFormat;
import java.text.ParsePosition;

public class ServletUtil {

    private static final Log log = LogFactory.getLog(Class.class);
    private static final Runtime runtime = Runtime.getRuntime();
    private static final long maxMemory = runtime.maxMemory();

    public static String getHostBaseURL(HttpServletRequest request) {
        StringBuffer requestURL = request.getRequestURL();
        String requestURI = request.getRequestURI();
        return requestURL.substring(0, requestURL.length() - requestURI.length());
    }

    public static boolean ensureMethod(HttpServletRequest request, HttpServletResponse response, String method) {
        boolean ret = getMethod(request).equalsIgnoreCase(method);
        if (!ret) {
            error(
                    response,
                    "Invalid Method: " + getMethod(request),
                    HttpServletResponse.SC_METHOD_NOT_ALLOWED
            );
        }
        return ret;
    }

    public static boolean isGet(HttpServletRequest request) {
        return "GET".equalsIgnoreCase(getMethod(request));
    }

    public static boolean isPost(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(getMethod(request));
    }

    public static String getMethod(HttpServletRequest request) {
        return request.getMethod();
    }

    public static String getCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            return null;

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(cookieName))
                return cookie.getValue();
        }

        return null;
    }

    public static void error(HttpServletResponse response, String msg, int status) {
        response.setStatus(status);
        try {
            write(response, msg);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    public static void write(HttpServletResponse response, String out) throws IOException {

        //Create UTF-8 writer and send UTF-8 encoded bytes to clients
        OutputStream os = response.getOutputStream();
        PrintStream writer = new PrintStream(os, false, ContentServiceConstants.RESPONSE_ENCODING);

        try {
            byte[] encodedBytes = out.getBytes(ContentServiceConstants.RESPONSE_ENCODING);
            response.setContentLength(encodedBytes.length);
            response.setContentType(ContentServiceConstants.CONTENT_TYPE);
            response.setCharacterEncoding(ContentServiceConstants.RESPONSE_ENCODING);

            writer.write(encodedBytes);
            writer.flush();

        } finally {
            writer.close();
        }
    }

    public static boolean isRestXMLRequest(HttpServletRequest request) {
        return ContentServiceConstants.WADL_URI.equalsIgnoreCase(request.getRequestURI());
    }

    public static boolean isNotifyChannelRequest(HttpServletRequest request) {
        return ContentServiceConstants.NOTIFY_CHANNEL_SERVLET_PATH.equalsIgnoreCase(request.getServletPath());
    }

    public static boolean isFrontChannelRequest(HttpServletRequest request) {
        return ContentServiceConstants.FRONT_CHANNEL_SERVLET_PATH.equalsIgnoreCase(request.getServletPath());
    }

    public static boolean isBackChannelRequest(HttpServletRequest request) {
        return ContentServiceConstants.BACK_CHANNEL_SERVLET_PATH.equalsIgnoreCase(request.getServletPath());
    }

    public static boolean isContentChannelRequest(HttpServletRequest request) {
        return ContentServiceConstants.CONTENT_CHANNEL_SERVLET_PATH.equalsIgnoreCase(request.getServletPath());
    }

    public static boolean isChunkedContentChannelRequest(HttpServletRequest request) {
        return ContentServiceConstants.CHUNKED_CONTENT_CHANNEL_SERVLET_PATH.equalsIgnoreCase(request.getServletPath());
    }

    public static void nullRead(HttpServletRequest request) throws IOException {
        InputStream is = request.getInputStream();
        byte[] buf = new byte[512];
        while (is.read(buf) > 0) ;
    }

    public static String readString(HttpServletRequest request) throws IOException {
        StringBuilder writer = new StringBuilder();
        char[] buf = new char[512];
        BufferedReader reader = request.getReader();
        int n;
        while ((n = reader.read(buf)) != -1) {
            writer.append(buf, 0, n);
        }
        return writer.toString();
    }

    public static boolean ensureMediaType(HttpServletRequest request, HttpServletResponse response, String mediaType) {
        boolean ret = isMediaType(request, mediaType);
        if (!ret) {
            error(
                    response,
                    "Invalid Media Type: " + getMediaType(request),
                    HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE
            );

        }
        return ret;
    }

    private static boolean isMediaType(HttpServletRequest request, String mediaType) {
        return request.getContentType().toLowerCase().contains(mediaType.toLowerCase());
    }

    private static String getMediaType(HttpServletRequest request) {
        return request.getContentType();
    }

    public static boolean isNumeric(String str) {
        NumberFormat formatter = NumberFormat.getInstance();
        ParsePosition pos = new ParsePosition(0);
        formatter.parse(str, pos);
        return str.length() == pos.getIndex();
    }

    public static long getPercentMemoryUsed() {
        long free = runtime.freeMemory();
        long total = runtime.totalMemory();
        long used = total - free;
        long percentUsed = (100 * used) / maxMemory;

        if (log.isInfoEnabled()) {
            log.info(String.format("Memory (max:total:free:used:pct) %d:%d:%d:%d:%d", maxMemory, total, free, used, percentUsed));
        }
        return percentUsed;
    }

    public static void runJavaGarbageCollector() {
        System.gc();
    }

    public static String getDownloadUrlForID(final String nodeID, final String vernum) {
        // e.g.: http://10.2.46.213/les_core_main/livelink.exe?func=otsync.fetch&NodeID=43014&vernum=1
        if (nodeID == null || nodeID.equals("")) return null;

        StringBuilder sb = new StringBuilder();
        sb.append(ContentServerService.getCsUrl());
        sb.append(ContentServiceConstants.URL_FROM_NODEID_PREFIX);
        sb.append(nodeID);
        sb.append(ContentServiceConstants.URL_FROM_NODEID_POSTFIX);
        if (vernum != null && !"".equals(vernum) && ServletUtil.isNumeric(vernum)) {
            sb.append(ContentServiceConstants.URL_VERNUM_PREFIX);
            sb.append(vernum);
        }

        return sb.toString();
    }
}
