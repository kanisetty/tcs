package com.opentext.otsync.content;

public class ContentServiceConstants {

    public static final String APP_NAME = "content";

    public static final String DIRECT_URL = "content.directUrl";
    public static final String CLEAN_UP_INTERVAL = "content.cleanUpInterval";
    public static final String UPLOAD_SOCKET_TIMEOUT = "content.uploadSocketTimeout";
    public static final String CS_CONNECTION_TIMEOUT = "content.csConnectionTimeout";
    public static final String REQUEST_TIMEOUT = "content.requestTimeout";
    public static final String CS_CONNECTIONS_MAX = "content.csConnectionsMax";
    public static final String LOGGING_VERBOSE = "content.loggingVerbose";
    public static final String WHITELIST = "content.whitelist";
    public static final String CS_SYNCTHREADS_MAX = "content.csSyncthreadsMax";
    public static final String TEMPDIR = "otag.tmp.path";
    public static final String REPO = "content.repo";
    public static final String IS_TEMPO_BOX_ENABLED = "content.enableTempoBox";
    public static final String CS_AUTH_ONLY = "content.csAuthOnly";
    public static final String MIN_VERSION_MAC = "content.clientMinVersionMac";
    public static final String CUR_VERSION_MAC = "content.clientCurrentVersionMac";
    public static final String INSTALL_FOLDER_MAC = "content.clientInstallerFolderMac";
    public static final String MIN_VERSION_WIN = "content.clientMinVersionWin";
    public static final String CUR_VERSION_WIN = "content.clientCurrentVersionWin";
    public static final String INSTALL_FOLDER_WIN = "content.clientInstallerFolderWin";

    public final static String OTSYNC_WEB_APP_NAME = "OTSyncServer";
    public final static String BACK_CHANNEL_NAME = "BackChannel";
    public final static String NOTIFY_CHANNEL_NAME = "NotifyChannel";
    public final static String FRONT_CHANNEL_NAME = "FrontChannel";
    public final static String CONTENT_CHANNEL_NAME = "ContentChannel";
    public final static String RESOURCE_CONTEXT_NAME = "resources";
    public final static String WADL_NAME = "application.wadl";
    public final static String OTSYNC_URI = "/" + OTSYNC_WEB_APP_NAME + "/";
    public final static String WADL_URI = OTSYNC_URI + RESOURCE_CONTEXT_NAME + "/" + WADL_NAME;
    public final static String BACK_CHANNEL_URI = OTSYNC_URI + BACK_CHANNEL_NAME + "/";
    public final static String FRONT_CHANNEL_URI = OTSYNC_URI + FRONT_CHANNEL_NAME + "/";
    public final static String CONTENT_CHANNEL_URI = OTSYNC_URI + CONTENT_CHANNEL_NAME + "/";
    public final static String BACK_CHANNEL_SERVLET_PATH = "/" + BACK_CHANNEL_NAME;
    public final static String NOTIFY_CHANNEL_SERVLET_PATH = "/" + NOTIFY_CHANNEL_NAME;
    public final static String FRONT_CHANNEL_SERVLET_PATH = "/" + FRONT_CHANNEL_NAME;
    public final static String CONTENT_CHANNEL_SERVLET_PATH = "/" + CONTENT_CHANNEL_NAME;
    public static final String URL_FROM_NODEID_PREFIX = "?func=otsyncll&objId=";
    public static final String URL_FROM_NODEID_POSTFIX = "&objAction=download&viewType=1";
    public static final String URL_VERNUM_PREFIX = "&vernum=";
    public static final int DEFAULT_STORED_RESPONSES = 2;
    public final static String CHAR_ENCODING = "UTF-8";
    public static final int MAX_CLIENTS_PER_USER = 256;
    public static final int MAX_ALLOWED_STORED_RESPONSES = 2;
    public static final String CONTENT_NODEID_PARAMETER_NAME = "nodeID";
    public static final String CONTENT_URL_PARAMETER_NAME = "url";
    public static final String CONTENT_VERNUM_PARAMETER_NAME = "vernum";

    // Gateway mail settings
    public static final String OTAG_SMTP_SSL = "otag.smtp.ssl";
    public static final String OTAG_SMTP_PASSWORD = "otag.smtp.password";
    public static final String OTAG_SMTP_USERNAME = "otag.smtp.username";
    public static final String OTAG_SMTP_PORT = "otag.smtp.port";
    public static final String OTAG_SMTP_HOST = "otag.smtp.host";
    public static final String OTAG_SMTP_FROM = "otag.smtp.from";

    public static final String OTAG_CLIENT_TIMEOUT = "notifications.cleanup.timeout";

    // Server constants
    public final static String CONTENT_TYPE = "application/json";
    public final static String MEDIA_TYPE_JSON = "application/json; charset=";
    public final static String METHOD_POST = "POST";
    public final static String RESPONSE_ENCODING = "UTF-8";
    public static final String TRUE_STRING = Boolean.TRUE.toString();
    public static final String FILE_UPLOAD_TYPE = "multipart/form-data";

    public final static String CS_COOKIE_NAME = "LLCookie";
    public final static String INCOMING_REQUEST_KEY = "http_request";
    public final static String CS_AUTH_TOKEN = "otcsticket";
}
