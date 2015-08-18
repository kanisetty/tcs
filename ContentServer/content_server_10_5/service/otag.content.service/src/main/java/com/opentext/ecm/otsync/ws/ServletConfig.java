package com.opentext.ecm.otsync.ws;

import static com.opentext.ecm.otsync.ContentServiceConstants.*;

// TODO FIXME not sure where these methods belong now, static kinda stuff
public class ServletConfig {

    public static int getMaxAllowedStoredResponses() {
        return MAX_ALLOWED_STORED_RESPONSES;
    }

    public static String getContentNodeIDParameterName() {
        return CONTENT_NODEID_PARAMETER_NAME;
    }

    public static String getContentVersionNumParameterName() {
        return CONTENT_VERNUM_PARAMETER_NAME;
    }

    public static String getContentUrlParameterName() {
        return CONTENT_URL_PARAMETER_NAME;
    }

    public static String getBackChannelServeletPath() {
        return BACK_CHANNEL_SERVLET_PATH;
    }

    public static String getNotifyChannelServeletPath() {
        return NOTIFY_CHANNEL_SERVLET_PATH;
    }

    public static String getFrontChannelServeletPath() {
        return FRONT_CHANNEL_SERVLET_PATH;
    }

    public static String getContentChannelServeletPath() {
        return CONTENT_CHANNEL_SERVLET_PATH;
    }

    public static String getChunkedContentChannelServeletPath() {
        return CHUNKED_CONTENT_CHANNEL_SERVLET_PATH;
    }

    public static String getWadlUri() {
        return WADL_URI;
    }

}
