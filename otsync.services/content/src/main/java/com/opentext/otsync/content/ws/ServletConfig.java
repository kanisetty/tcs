package com.opentext.otsync.content.ws;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.content.ws.server.ClientType;
import com.opentext.otsync.content.otag.ContentServerService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.opentext.otsync.content.ContentServiceConstants;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.ResourceBundle;

/**
 * Used by JSPs.
 */
public class ServletConfig {

    private static final Log LOG = LogFactory.getLog(ServletConfig.class);

    // version and link information
    private static Map<String, ClientType> clientInfo = null;

    private static String productName = null;
    private static String shortProductName = null;
    private static String companyName = null;

    public static String getProductName() {
        if (productName == null) {
            ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
            productName = strings.getString("productName");
        }
        return productName;
    }

    public static String getShortProductName() {
        if (shortProductName == null) {
            ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
            shortProductName = strings.getString("shortProductName");
        }
        return shortProductName;
    }

    public static String getCompanyName() {
        if (companyName == null) {
            ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
            companyName = strings.getString("companyName");
        }
        return companyName;
    }

    public static String getContentServerUrl() {
        return ContentServerService.getCsUrl();
    }

    public static String getContentServerDirectUrl() throws APIException {

        return ContentServerService.getCsUrl();
    }

    private static SettingsClient getSettingsClient() {
        return ContentServerService.getSettingsClient();
    }

    public static String getContentServerBaseUrl() {
        String relativeUrl = getContentServerRelativeURL();
        String csUrl = getContentServerUrl();
        return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }

    public static String getContentServerDirectBaseURL() throws APIException {
        String relativeUrl = getContentServerDirectRelativeURL();
        String csUrl = getContentServerDirectUrl();
        return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }

    public static String getContentServerRelativeURL() {
        try {
            String contentServerUrl = getContentServerUrl();

            if (contentServerUrl != null) {
                URI csUri = new URI(contentServerUrl);
                return csUri.getRawPath();
            }
            return "";
        } catch (URISyntaxException e) {
            LOG.error(e);
            return "";
        }
    }

    public static String getContentServerDirectRelativeURL() throws APIException {
        try {
            String contentServerDirectUrl = getContentServerDirectUrl();
            if (contentServerDirectUrl != null) {
                URI csUri = new URI(contentServerDirectUrl);
                return csUri.getRawPath();
            }
            return "";
        } catch (URISyntaxException e) {
            LOG.error(e);
            return "";
        }
    }

    public static boolean isTempoBoxEnabled() throws APIException {
        final SettingsClient settingsClient = getSettingsClient();
        return settingsClient != null && settingsClient.getSettingAsBool(ContentServiceConstants.IS_TEMPO_BOX_ENABLED);
    }

    public static String getRepo() throws APIException {
        final SettingsClient settingsClient = getSettingsClient();
        return (settingsClient != null) ? settingsClient.getSettingAsString(ContentServiceConstants.REPO) : "";
    }

    /*
     * Get client information for the default client, WIN64
     * This exists so that legacy Windows clients can still check version
     * requirements without passing the new parameters.
     */
    public static ClientType getClient() {
        LOG.info("Legacy Windows client connecting");
        clientInfo = ContentServerService.getClientInfo();
        return clientInfo.get("WIN64");
    }

    /*
     * Get client information for a given client type.
     * As clients are identified in the properties file either by os (Android), os + osVersion (BB6)
     * or os + bitness (Win32) all three of these combinations will be tried.
     * If the properties file changes, users of this method will be unaffected by the internal change.
     */
    public static ClientType getClient(String clientOS, String clientOSVersion, String clientBitness) {

        String os = (clientOS == null) ? "" : clientOS.toUpperCase();
        String osVersion = (clientOSVersion == null) ? "" : clientOSVersion.toUpperCase();
        String bitness = (clientBitness == null) ? "" : clientBitness.toUpperCase();

        clientInfo = ContentServerService.getClientInfo();

        if (clientInfo.containsKey(os)) {
            return clientInfo.get(os);
        } else if (clientInfo.containsKey(os + osVersion)) {
            return clientInfo.get(os + osVersion);
        } else if (clientInfo.containsKey(os + bitness)) {
            return clientInfo.get(os + bitness);
        }

        LOG.info("Unknown client type connecting: os=" + os + ", osVersion=" + osVersion + ", bitness=" + bitness);

        return null;
    }

}
