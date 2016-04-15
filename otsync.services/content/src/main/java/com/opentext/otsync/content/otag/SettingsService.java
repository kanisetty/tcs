package com.opentext.otsync.content.otag;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
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

    // TODO FIXME MOST OF THIS NEEDS TO BE CACHED AND LISTENED TO, ASKING OTAG FOR SETTINGS ALL THE TIME ISNT RIGHT

    public boolean isTempoBoxEnabled() throws APIException {
        return settingsClient.getSettingAsBool(ContentServiceConstants.IS_TEMPO_BOX_ENABLED);
    }

    public String getRepo() throws APIException {
        return settingsClient.getSettingAsString(ContentServiceConstants.REPO);
    }

    public String getTempfileDir() throws APIException {
        return settingsClient.getSettingAsString(ContentServiceConstants.TEMPDIR);
    }

    public int getSharedThreadPoolSize() throws APIException {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_SYNCTHREADS_MAX);
    }


    public String[] getValidURLWhiteList() throws APIException {
        String[] validURLWhiteList = {};
        String whiteList = settingsClient.getSettingAsString(ContentServiceConstants.WHITELIST);
        if (whiteList != null && whiteList.trim().length() > 0) {
            validURLWhiteList = whiteList.split(",");
        }
        return validURLWhiteList;
    }

    public boolean wantFrontChannelLogs() throws APIException {
        return settingsClient.getSettingAsBool(ContentServiceConstants.LOGGING_VERBOSE);
    }

    public int getCSConnectionPoolSize() throws APIException {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_CONNECTIONS_MAX);
    }

    public int getServlet3RequestTimeout() throws APIException {
        return settingsClient.getSettingAsInt(ContentServiceConstants.REQUEST_TIMEOUT);
    }

    public int getConnectionTimeout() throws APIException {
        return settingsClient.getSettingAsInt(ContentServiceConstants.CS_CONNECTION_TIMEOUT);
    }

    public int getUploadSocketTimeout() throws APIException {
        return settingsClient.getSettingAsInt(ContentServiceConstants.UPLOAD_SOCKET_TIMEOUT);
    }

    public int getServlet3ContentTimeout() throws APIException {
        return getServlet3RequestTimeout() * 30;
    }

    public long getCleanUpInterval() throws APIException {
        return settingsClient.getSettingAsLong(ContentServiceConstants.CLEAN_UP_INTERVAL);
    }

    public long getClientTimeOut() throws APIException {
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

    public String getMinVersionMac() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.MIN_VERSION_MAC); }

    public String getCurVersionMac() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.CUR_VERSION_MAC); }

    public String getInstallerFolderMac() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.INSTALL_FOLDER_MAC); }

    public String getMinVersionWin() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.MIN_VERSION_WIN); }

    public String getCurVersionWin() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.CUR_VERSION_WIN); }

    public String getInstallerFolderWin() throws APIException { return settingsClient.getSettingAsString(ContentServiceConstants.INSTALL_FOLDER_WIN); }


}
