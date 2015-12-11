package com.opentext.otsync.content.otag;

import com.opentext.otsync.content.engine.ContentServiceEngine;
import com.opentext.otsync.content.ws.server.ClientType;
import com.opentext.otsync.content.http.HTTPRequestManager;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.sdk.client.AuthClient;
import com.opentext.otag.sdk.client.NotificationsClient;
import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient.ConnectionResult;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.opentext.otsync.content.ContentServiceConstants;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Content Server Appworks Service. Responds to the Gateways startup signal initialising
 * the Engine component and the rest of the service.
 */
public class ContentServerService implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ContentServerService.class);

    // ClientType settings
    public static final String CLIENTVERSIONFORDOWNLOAD = "CLIENTVERSIONFORDOWNLOAD";
    public static final String CLIENTVERSION = "CLIENTVERSION";
    public static final String CLIENT = "CLIENT";

    /**
     * Content server connector, retains the EIM connection and keeps the
     * connection String up to date (admin UI can configure the connector).
     */
    private static EIMConnectorClient csConnector;

    // version and link information from tempo.clients.properties
    private static Map<String, ClientType> clientInfo;

    private static ContentServiceEngine serviceEngine;

    // Gateway services
    private static SettingsClient settingsClient;
    private static SettingsService settingsService;
    private static AuthClient AuthClient;

    private static HTTPRequestManager httpRequestManager;

    // this method will attempt to complete the deployment passing the result to the Gateway
    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        ServiceClient serviceClient = new ServiceClient();

        try {
            LOG.info("Starting Content Server ContentService ...");

            try {
                csConnector = new EIMConnectorClientImpl("OTSync", "16.0.0");
                ConnectionResult connectionResult = csConnector.connect();
                if (!connectionResult.isSuccess()) {
                    String errMsg = "Failed connection result =" + connectionResult.getMessage();
                    LOG.error(errMsg);
                    throw new RuntimeException(errMsg);
                }
            } catch (Exception e) {
                // record the specifics here
                LOG.error("Connection failed for Content Server: " + e.getMessage(), e);
                throw e;
            }

            settingsClient = new SettingsClient();
            LOG.debug("Created SettingsClient");
            settingsService = new SettingsService(settingsClient);
            LOG.debug("Created SettingsService");
            AuthClient = new AuthClient();
            LOG.debug("Created AuthClient");

            httpRequestManager = new HTTPRequestManager(settingsService);
            LOG.debug("HTTP Manager initialised");

            serviceEngine = new ContentServiceEngine(
                    settingsService,
                    new NotificationsClient(),
                    httpRequestManager);
            LOG.debug("Initialised Content Service engine");

            upgradeFromExistingTempoProperties();

            // Copy Sample Properties File to conf
            File sourceFile;
            File destinationFile;
            String clientFilePath = System.getProperty("catalina.base") +
                    "/webapps/content/WEB-INF/tempo.clients.properties";
            String destFileName = System.getProperty("catalina.base") +
                    "/conf/tempo.clients.properties";

            sourceFile = new File(clientFilePath);
            destinationFile = new File(destFileName);
            try {
                if (!destinationFile.canRead())
                    FileUtils.copyFile(sourceFile, destinationFile);
            } catch (IOException e) {
                LOG.error(e);
            }

            // Read and set client properties for client tracking and maintenance
            setClientProperties();

            boolean completeAck = serviceClient.completeDeployment(new DeploymentResult(true));
            if (completeAck) {
                LOG.info("ContentService init complete");
            } else {
                LOG.error("Failed to complete deployment, deployment result was rejected");
            }
        } catch (Exception e) {
            String errMsg = "Service failed to start correctly, " + e.getMessage();
            LOG.error(errMsg, e);
            serviceClient.completeDeployment(new DeploymentResult(errMsg));
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Shutting down Content Service Engine ...");
        if (serviceEngine != null)
            serviceEngine.shutdown();
    }

    public static Map<String, ClientType> getClientInfo(){
        return clientInfo;
    }

    /**
     * Access the Content Server URL, without this piece of information all channels
     * are locked down. This method returns null if we failed to connect to Content
     * Server.
     *
     * @return the content server URL
     */
    public static String getCsUrl() {
        boolean connectionStringDefined = csConnector != null &&
                csConnector.getConnectionString() != null &&
                !csConnector.getConnectionString().trim().isEmpty();

        return connectionStringDefined ? csConnector.getConnectionString() : null;
    }

    public static boolean isCsUrlDefined() {
        return getCsUrl() != null;
    }

    // Provide access to our central components and Gateway clients across the service

    public static ContentServiceEngine getEngine() {
        return serviceEngine;
    }

    public static AuthClient getIdService() {
        return AuthClient;
    }

    public static SettingsClient getSettingsClient() {
        return settingsClient;
    }

    public static HTTPRequestManager getHttpManager() {
        return httpRequestManager;
    }

    public static SettingsService getSettingsService() {
        return settingsService;
    }

    private void upgradeFromExistingTempoProperties() {
        File propertiesFile = new File(System.getProperty("catalina.base") + "/conf/tempo.properties");
        if (propertiesFile.canRead()) {

            // read the properties, then rename the file to a backup so we won't look at it again
            Properties properties = new Properties();

            try (FileInputStream in = new FileInputStream(propertiesFile)) {
                properties.load(in);
            } catch (IOException e) {
                LOG.error("Cannot load tempo.properties. You will need to set your old configuration manually.");
            }

            try {
                FileUtils.moveFile(propertiesFile, new File(System.getProperty("catalina.base") +
                        "/conf/tempo.properties.preupgrade"));
                LOG.info("Renamed old tempo.properties file to tempo.properties.preupgrade");
            } catch (IOException e) {
                LOG.warn("Could not rename old tempo.properties file in <tomcat>/conf; please " +
                        "delete or rename this file.", e);
            }

            try {
                setOldProperties(properties);
            } catch (Exception e) {
                LOG.error("Error while upgrading settings.", e);
            }
        }
    }

    private void setClientProperties() {
        Properties clientProperties = new Properties();

        try {
            clientProperties.load(new FileInputStream(System.getProperty("catalina.base") +
                    "/conf/tempo.clients.properties"));
        } catch (FileNotFoundException e) {
            LOG.error("Cannot load tempo.clients.properties. Going into server meltdown mode " +
                    "(tempo.clients.properties must be in " + System.getProperty("catalina.base") + "/conf).");
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
                //Get the Client Type, including language for use as the client key prefix
                prefix = key.substring(0, key.indexOf("CLIENT"));

                if (key.contains("_")) {
                    languageKey = key.substring(key.indexOf("_") + 1, key.length());
                }

                //Retrieve the client info from the clientInfo map, or create new client
                // info map if this is a new client
                if (clientInfo.containsKey(prefix)) {
                    client = clientInfo.get(prefix);
                } else {
                    client = new ClientType(prefix);
                    clientInfo.put(prefix, client);
                }
            }

            // Get the Minimum Version, Current Version and Client Link
            if (client != null) {
                if (key.contains(CLIENTVERSIONFORDOWNLOAD)) {
                    client.setCurrentVersion(value);
                } else if (key.contains(CLIENTVERSION)) {
                    client.setMinVersion(value);
                } else if (key.contains(CLIENT)) {
                    client.setClientLink(value, languageKey);
                }
            }
        }
    }

    private void setOldProperties(Properties properties) {
        importSetting(properties, ContentServiceConstants.REPO, "repo");
        importSetting(properties, ContentServiceConstants.TEMPDIR, "TempfileDir");
        importSetting(properties, ContentServiceConstants.CS_SYNCTHREADS_MAX, "cs.syncthreads.max");
        importSetting(properties, ContentServiceConstants.WHITELIST, "ValidURLWhiteList");
        importSetting(properties, ContentServiceConstants.LOGGING_VERBOSE, "WantFrontChannelLogs");
        importSetting(properties, ContentServiceConstants.CS_CONNECTIONS_MAX, "cs.connections.max");
        importSetting(properties, ContentServiceConstants.REQUEST_TIMEOUT, "request.timeout");
        importSetting(properties, ContentServiceConstants.CS_CONNECTION_TIMEOUT, "cs.connection.timeout");
        importSetting(properties, ContentServiceConstants.UPLOAD_SOCKET_TIMEOUT, "upload.socket.timeout");
        importSetting(properties, ContentServiceConstants.CLEAN_UP_INTERVAL, "CleanUpInterval");

        String directBaseUrl = properties.getProperty("ContentServerDirectBaseURL");
        String directRelativeUrl = properties.getProperty("ContentServerDirectRelativeURL");

        if (directBaseUrl != null && directRelativeUrl != null) {
            String fullDirectUrl = directBaseUrl + directRelativeUrl;
            LOG.info("Content service importing " + ContentServiceConstants.DIRECT_URL + " as " + fullDirectUrl);
            Setting directUrl = settingsClient.getSetting(ContentServiceConstants.DIRECT_URL);
            directUrl.setValue(fullDirectUrl);
            settingsClient.updateSetting(directUrl);
        }

        overrideMailSettings(properties);
    }

    private void overrideMailSettings(Properties properties) {
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_FROM, "com.opentext.tempoinvite.mail.smtp.from");
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_HOST, "com.opentext.tempoinvite.mail.smtp.host");
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_PASSWORD, "com.opentext.tempoinvite.mail.smtp.password");
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_PORT, "com.opentext.tempoinvite.mail.smtp.port");
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_SSL, "com.opentext.tempoinvite.mail.smtp.ssl");
        importSetting(properties, ContentServiceConstants.OTAG_SMTP_USERNAME, "com.opentext.tempoinvite.mail.smtp.username");
    }

    private void importSetting(Properties properties, String otagSetting, String property) {
        String oldValue = properties.getProperty(property);
        Setting setting = settingsClient.getSetting(otagSetting);
        if (oldValue != null && !oldValue.equals(setting.getValue())) {
            setting.setValue(oldValue);
            settingsClient.updateSetting(setting);
        }
    }

}
