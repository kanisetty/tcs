package com.opentext.otsync.content.otag;

import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otsync.content.ContentServiceConstants;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Encapsulates access to the config Settings stored at the Gateway that the
 * ContentService is interested in.
 */
public class SettingsService {

    private static final Log LOG = LogFactory.getLog(SettingsService.class);

    private SettingsClient settingsClient;

    public SettingsService(SettingsClient settingsClient) {
        this.settingsClient = settingsClient;
    }

    public boolean isTempoBoxEnabled() {
        return settingsClient.getSettingAsBool(ContentServiceConstants.IS_TEMPO_BOX_ENABLED);
    }

    public String getRepo() {
        return settingsClient.getSettingAsString(ContentServiceConstants.REPO);
    }

    public String getTempfileDir() {
        return settingsClient.getSettingAsString(ContentServiceConstants.TEMPDIR);
    }

    public int getSharedThreadPoolSize() {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_SYNCTHREADS_MAX);
    }

    public long getChunkSize() {
        return settingsClient.getSettingAsLong(ContentServiceConstants.CHUNKSIZE);
    }

    public long getChunkedContentCacheExpiryTime() {
        return settingsClient.getSettingAsLong(ContentServiceConstants.CHUNKEDCONTENT_CACHE_EXPIRY);
    }

    public String[] getValidURLWhiteList() {
        String[] validURLWhiteList = {};
        String whiteList = settingsClient.getSettingAsString(ContentServiceConstants.WHITELIST);
        if (whiteList != null && whiteList.trim().length() > 0) {
            validURLWhiteList = whiteList.split(",");
        }
        return validURLWhiteList;
    }

    public boolean wantFrontChannelLogs() {
        return settingsClient.getSettingAsBool(ContentServiceConstants.LOGGING_VERBOSE);
    }

    public int getCSConnectionPoolSize() {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_CONNECTIONS_MAX);
    }

    public int getServlet3RequestTimeout() {
        return settingsClient.getSettingAsInt(ContentServiceConstants.REQUEST_TIMEOUT);
    }

    public int getConnectionTimeout() {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_CONNECTION_TIMEOUT);
    }

    public int getUploadSocketTimeout() {
        return settingsClient.getSettingAsInt(ContentServiceConstants.UPLOAD_SOCKET_TIMEOUT);
    }

    public int getServlet3ContentTimeout() {
        return getServlet3RequestTimeout() * 30;
    }

    public long getCleanUpInterval() {
        return settingsClient.getSettingAsLong(ContentServiceConstants.CLEAN_UP_INTERVAL);
    }

    public long getClientTimeOut() {
        return settingsClient.getSettingAsLong(ContentServiceConstants.OTAG_CLIENT_TIMEOUT);
    }

    public String getContentServerUrl() {
        return ContentServerService.getCsUrl();
    }

    public String getContentServerBaseUrl() {
        String relativeUrl = getContentServerRelativeURL();
        String csUrl = getContentServerUrl();
        return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }

    public String getContentServerRelativeURL() {
        try {
            URI csUri = new URI(getContentServerUrl());
            return csUri.getRawPath();
        } catch (URISyntaxException e) {
            LOG.error(e);
            return "";
        }
    }
}
