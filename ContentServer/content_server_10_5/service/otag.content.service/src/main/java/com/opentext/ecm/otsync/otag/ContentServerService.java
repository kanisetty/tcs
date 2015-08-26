package com.opentext.ecm.otsync.otag;

import com.opentext.ecm.otsync.auth.ContentServerAuthHandler;
import com.opentext.ecm.otsync.engine.ContentServiceEngine;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.ws.server.ClientType;
import com.opentext.otag.CSConstants;
import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.services.client.IdentityServiceClient;
import com.opentext.otag.api.services.client.NotificationsClient;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.services.client.TrustedProviderClient;
import com.opentext.otag.api.services.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.api.shared.types.auth.AuthHandler;
import com.opentext.otag.api.shared.types.auth.RegisterAuthHandlersRequest;
import com.opentext.otag.api.shared.types.message.SettingsChangeMessage;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.api.shared.types.settings.SettingType;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static com.opentext.ecm.otsync.ContentServiceConstants.*;

/**
 * Content Server Appworks Service. Responds to the Gateways startup signal initialising
 * the Engine component and the rest of the service.
 */
public class ContentServerService extends ContentServerAppworksServiceBase {

    private static final Log LOG = LogFactory.getLog(ContentServerService.class);

    /**
     * This setting really determines if we will attempt to contact OTDS to resolve
     * usernames when performing auth actions using our {@code AuthRequestHandler}
     * implementation to service requests.
     *
     * @see ContentServerAuthHandler
     */
    @SuppressWarnings("unused")
    public static class CsAuthOnlyListener extends AbstractSettingChangeHandler {

        @Override
        public String getSettingKey() {
            return CS_AUTH_ONLY;
        }

        @Override
        public void onSettingChanged(SettingsChangeMessage message) {
            // re-register the auth providers
            if (registerAuthProviderThread != null && registerAuthProviderThread.isAlive())
                registerAuthProviderThread.shutdown();

            registerAuthProviderThread = new RegisterAuthProviderThread();
        }
    }

    // ClientType settings
    public static final String CLIENTVERSIONFORDOWNLOAD = "CLIENTVERSIONFORDOWNLOAD";
    public static final String CLIENTVERSION = "CLIENTVERSION";
    public static final String CLIENT = "CLIENT";

    /**
     * Content server URL.
     */
    private static String csUrl = null;

    // Trusted provider (Gateway API key)
    public static final String CONTENTSERVER_PROVIDER_NAME = "ContentServer";

    // version and link information from tempo.clients.properties
    private static Map<String, ClientType> clientInfo;

    private static ContentServiceEngine serviceEngine;

    // Gateway services
    private static SettingsClient settingsClient;
    private static SettingsService settingsService;
    private static IdentityServiceClient identityServiceClient;
    private static TrustedProviderClient trustedProviderClient;

    private static HTTPRequestManager httpRequestManager;

    private static RegisterAuthProviderThread registerAuthProviderThread;

    /**
     * In order to resolve the OTDS resource id that we are interested in (for username
     * mapping) we need the CS url to be defined correctly. Register our auth handler
     * when we know we can build the AuthProvider with the OTDS resource id.
     */
    public static class RegisterAuthProviderThread extends Thread {

        private ContentServerAuthHandler csAuthHandler;

        private boolean keepRunning = true;

        public RegisterAuthProviderThread() {
            super("Register CS auth providers Thread");
            csAuthHandler = AppworksComponentContext.getComponent(ContentServerAuthHandler.class);
        }

        @Override
        public void run() {
            LOG.info("Starting CS auth handler registration Thread");
            while (keepRunning) {
                try {
                    // the OTDS resource id will be resolved as part of the base build method so we can check it
                    AuthHandler handler = csAuthHandler.buildHandler();

                    RegisterAuthHandlersRequest registerAuthHandlersRequest = new RegisterAuthHandlersRequest();
                    // re-evaluate via db to see if we expect the OTDS resource id to be populated
                    boolean csAuthOnly = settingsService.isCsAuthOnly();
                    if (!csAuthOnly) {
                        String otdsResourceId = handler.getOtdsResourceId();
                        if (otdsResourceId != null) {
                            issueRequest(handler, registerAuthHandlersRequest);
                            keepRunning = false;
                            LOG.info("Registered CS Auth handler with Gateway");
                        } else {
                            LOG.info("Still unable to resolve OTDS resource id, sleeping ...");
                            Thread.sleep(20 * 1000);
                        }
                    } else {
                        issueRequest(handler, registerAuthHandlersRequest);
                        keepRunning = false;
                    }
                } catch (Exception e) {
                    LOG.info("Failed to retrieve OTDS resource id");
                }
            }
        }

        public void shutdown() {
            try {
                LOG.info("Shutting down " + this.getName());
                keepRunning = false;
                this.interrupt();
            } catch (Exception e) {
                LOG.error("Shutdown for "  + this.getName() + " did not complete " +
                        "successfully, " + e.getMessage(), e);
            }
        }

        private void issueRequest(AuthHandler handler,
                                  RegisterAuthHandlersRequest registerAuthHandlersRequest) {
            registerAuthHandlersRequest.addHandler(handler);
            identityServiceClient.registerAuthHandlers(registerAuthHandlersRequest);
        }

    }

    /**
     * Access the Content Server URL, without this piece of information all channels are locked down.
     *
     * @return the content server URL
     */
    public static String getCsUrl() {
        return csUrl;
    }

    public static boolean isCsUrlDefined() {
        return "".equals(getCsUrl());
    }

    @Override
    public void onStart(String appName) {
        super.onStart(appName);
        LOG.info("Starting Content Server ContentService ...");

        settingsClient = new SettingsClient(appName);
        LOG.debug("Created SettingsClient");
        settingsService = new SettingsService(settingsClient);
        LOG.debug("Created SettingsService");
        identityServiceClient = new IdentityServiceClient(appName);
        LOG.debug("Created IdentityServiceClient");
        trustedProviderClient = new TrustedProviderClient(appName);
        LOG.debug("Created TrustedProviderClient");

        // create CS URL (contentserver.url) setting if it doesn't exist already
        initCsUrlSetting(settingsClient);

        httpRequestManager = new HTTPRequestManager(settingsService);
        LOG.debug("HTTP Manager initialised");

        serviceEngine = new ContentServiceEngine(
                settingsService,
                new NotificationsClient(appName),
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

        registerAuthHandlers();
        LOG.info("ContentService init complete");
    }

    private void initCsUrlSetting(SettingsClient settingsClient) {
        Setting csUrlSetting = settingsClient.getSetting(CSConstants.CONTENTSERVER_URL);
        if (csUrlSetting == null) {
            LOG.warn("Initialising Content Server URL Setting for the first time, it will need to be " +
                    "populated before the service will run");
            // TODO remove test system url
            String csUrlVal = /*"http://aw-dev-cs1.appworks.dev/otcs/cs.exe"*/"";
            csUrlSetting = new Setting(CSConstants.CONTENTSERVER_URL, APP_NAME, SettingType.string,
                    "Content Server URL", csUrlVal, "http/s://host/otcs/cs.exe", "Content Server URL", false);
            boolean created = settingsClient.createSetting(csUrlSetting);
            if (!created) {
                LOG.warn("Failed to create CS URL setting!");
                return;
            }
            csUrl = "";
        } else {
            csUrl = csUrlSetting.getValue();
        }
    }

    // we listen for changes to the Cs URL setting via our parent
    @Override
    public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
        super.onSettingChanged(settingsChangeMessage);
        // update our local csUrl
        csUrl = settingsChangeMessage.getNewValue();
        registerAuthHandlers();
    }

    /**
     * Register our auth handlers implementation contained in this service.
     */
    public static void registerAuthHandlers() {
        if (registerAuthProviderThread != null && registerAuthProviderThread.isAlive())
            registerAuthProviderThread.shutdown();

        registerAuthProviderThread = new RegisterAuthProviderThread();
        registerAuthProviderThread.start();
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Shutting down Content Service Engine ...");
        if (serviceEngine != null)
            serviceEngine.shutdown();

        if (registerAuthProviderThread != null && registerAuthProviderThread.isAlive()) {
            LOG.info("Shutting down register auth provider Thread, we never " +
                    "resolved the OTDS resource id!");
            registerAuthProviderThread.shutdown();
        }

        super.onStop(appName);
    }

    // Provide access to our central components and Gateway clients across the service

    public static ContentServiceEngine getEngine() {
        return serviceEngine;
    }

    public static IdentityServiceClient getIdService() {
        return identityServiceClient;
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
        importSetting(properties, REPO, "repo");
        importSetting(properties, TEMPDIR, "TempfileDir");
        importSetting(properties, CS_SYNCTHREADS_MAX, "cs.syncthreads.max");
        importSetting(properties, CHUNKSIZE, "ChunkSize");
        importSetting(properties, CHUNKEDCONTENT_CACHE_EXPIRY, "ChunkedContentCacheExpiryTime");
        importSetting(properties, WHITELIST, "ValidURLWhiteList");
        importSetting(properties, LOGGING_VERBOSE, "WantFrontChannelLogs");
        importSetting(properties, CS_CONNECTIONS_MAX, "cs.connections.max");
        importSetting(properties, REQUEST_TIMEOUT, "request.timeout");
        importSetting(properties, CS_CONNECTION_TIMEOUT, "cs.connection.timeout");
        importSetting(properties, UPLOAD_SOCKET_TIMEOUT, "upload.socket.timeout");
        importSetting(properties, CLEAN_UP_INTERVAL, "CleanUpInterval");

        String directBaseUrl = properties.getProperty("ContentServerDirectBaseURL");
        String directRelativeUrl = properties.getProperty("ContentServerDirectRelativeURL");

        if (directBaseUrl != null && directRelativeUrl != null) {
            String fullDirectUrl = directBaseUrl + directRelativeUrl;
            LOG.info("Content service importing " + DIRECT_URL + " as " + fullDirectUrl);
            Setting directUrl = settingsClient.getSetting(DIRECT_URL);
            directUrl.setValue(fullDirectUrl);
            settingsClient.updateSetting(directUrl);
        }

        overrideMailSettings(properties);
    }

    private void overrideMailSettings(Properties properties) {
        importSetting(properties, OTAG_SMTP_FROM, "com.opentext.tempoinvite.mail.smtp.from");
        importSetting(properties, OTAG_SMTP_HOST, "com.opentext.tempoinvite.mail.smtp.host");
        importSetting(properties, OTAG_SMTP_PASSWORD, "com.opentext.tempoinvite.mail.smtp.password");
        importSetting(properties, OTAG_SMTP_PORT, "com.opentext.tempoinvite.mail.smtp.port");
        importSetting(properties, OTAG_SMTP_SSL, "com.opentext.tempoinvite.mail.smtp.ssl");
        importSetting(properties, OTAG_SMTP_USERNAME, "com.opentext.tempoinvite.mail.smtp.username");
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
