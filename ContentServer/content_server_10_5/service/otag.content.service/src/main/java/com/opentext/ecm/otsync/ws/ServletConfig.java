package com.opentext.ecm.otsync.ws;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.ws.server.ClientType;
import com.opentext.otag.sdk.client.SettingsClient;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.ResourceBundle;

import static com.opentext.ecm.otsync.ContentServiceConstants.*;

/**
 * Used by JSPs.
 */
public class ServletConfig {

    private static final Log LOG = LogFactory.getLog(ServletConfig.class);

    // version and link information from tempo.clients.properties
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

    public static String getContentServerDirectUrl() {
        final SettingsClient settingsClient = getSettingsClient();
        String url = null;

        if (settingsClient != null)
            url = settingsClient.getSetting(DIRECT_URL).getValue();

        if (url == null || url.isEmpty()) {
            url = getContentServerUrl();
        }
        return url;
    }

    private static SettingsClient getSettingsClient() {
        return ContentServerService.getSettingsClient();
    }

    public static String getContentServerBaseUrl() {
        String relativeUrl = getContentServerRelativeURL();
        String csUrl = getContentServerUrl();
        return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }

    public static String getContentServerDirectBaseURL() {
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

    public static String getContentServerDirectRelativeURL() {
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

    public static boolean isTempoBoxEnabled() {
        final SettingsClient settingsClient = getSettingsClient();
        return settingsClient != null && settingsClient.getSettingAsBool(IS_TEMPO_BOX_ENABLED);
    }

    public static String getRepo() {
        final SettingsClient settingsClient = getSettingsClient();
        return (settingsClient != null) ? settingsClient.getSettingAsString(REPO) : "";
    }

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

    private static void setClientProperties() {

        Properties clientProperties = new Properties();

        try {
            clientProperties.load(new FileInputStream(System.getProperty("catalina.base") + "/conf/tempo.clients.properties"));
        } catch (FileNotFoundException e) {
            LOG.error("Cannot load tempo.clients.properties. Going into server meltdown mode (tempo.clients.properties must be in "
                    + System.getProperty("catalina.base") + "/conf).");
        } catch (IOException e) {
            LOG.error("Cannot load tempo.clients.properties. Going into server meltdown mode (fix your config).");
        }


        // Add all client information to the clientInfo Map
        clientInfo = new HashMap<>();

        // Loop through all properties building up client information
        for (Map.Entry<Object, Object> entry : clientProperties.entrySet()) {
            String key = ((String) entry.getKey()).toUpperCase();
            String value = (String) entry.getValue();
            String prefix;
            String languageKey = "";
            ClientType client = null;

            LOG.debug("Properties: key=" + key + ", value=" + value);

            // Initialize client
            if (key.contains("CLIENT")) {
                // Get the Client Type, including language for use as the client key prefix
                prefix = key.substring(0, key.indexOf("CLIENT"));

                if (key.contains("_")) {
                    languageKey = key.substring(key.indexOf("_") + 1, key.length());
                }

                // Retrieve the client info from the clientInfo map, or create new client info map if this is a new client
                if (clientInfo.containsKey(prefix)) {
                    client = clientInfo.get(prefix);
                } else {
                    client = new ClientType(prefix);
                    clientInfo.put(prefix, client);
                }
            }

            if (client != null) {
                // Get the Minimum Version, Current Version and Client Link
                if (key.contains("CLIENTVERSIONFORDOWNLOAD")) {
                    client.setCurrentVersion(value);
                } else if (key.contains("CLIENTVERSION")) {
                    client.setMinVersion(value);
                } else if (key.contains("CLIENT")) {
                    client.setClientLink(value, languageKey);
                }
            }
        }
    }

    /*
     * Get client information for the default client, WIN64
     * This exists so that legacy Windows clients can still check version
     * requirements without passing the new parameters.
     */
    public static ClientType getClient() {
        LOG.info("Legacy Windows client connecting");
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
