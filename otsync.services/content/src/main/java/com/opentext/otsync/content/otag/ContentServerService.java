package com.opentext.otsync.content.otag;

import com.opentext.otag.sdk.client.v3.AuthClient;
import com.opentext.otag.sdk.client.v3.NotificationsClient;
import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient.ConnectionResult;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otsync.content.engine.ContentServiceEngine;
import com.opentext.otsync.content.http.HTTPRequestManager;
import com.opentext.otsync.content.ws.server.ClientType;
import com.opentext.otsync.otag.EIMConnectorHelper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Map;

/**
 * Content Server Appworks Service. Responds to the Gateways startup signal initialising
 * the Engine component and the rest of the service.
 */
public class ContentServerService implements AWServiceContextHandler {

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

    // version and link information
    private static Map<String, ClientType> clientInfo;

    private static ContentServiceEngine serviceEngine;

    // Gateway services
    private static SettingsClient settingsClient;
    private static SettingsService settingsService;
    private static AuthClient authClient;

    private static HTTPRequestManager httpRequestManager;

    // this method will attempt to complete the deployment passing the result to the Gateway
    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        ServiceClient serviceClient = new ServiceClient();

        try {
            LOG.info("Starting Content Server ContentService ...");

            try {
                csConnector = EIMConnectorHelper.getCurrentClient();
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
            authClient = new AuthClient();
            LOG.debug("Created AuthClient");

            httpRequestManager = new HTTPRequestManager(settingsService);
            LOG.debug("HTTP Manager initialised");

            serviceEngine = new ContentServiceEngine(
                    settingsService,
                    new NotificationsClient(),
                    httpRequestManager);
            LOG.debug("Initialised Content Service engine");

            SDKResponse sdkResponse = serviceClient.completeDeployment(new DeploymentResult(true));
            boolean completeAck = sdkResponse.isSuccess();
            if (completeAck) {
                LOG.info("ContentService init complete");
            } else {
                LOG.error("Failed to complete deployment, deployment result was rejected");
            }
        } catch (Exception e) {
            String errMsg = "Service failed to start correctly, " + e.getMessage();
            LOG.error(errMsg, e);
            try {
                serviceClient.completeDeployment(new DeploymentResult(errMsg));
            } catch (APIException e1) {
                LOG.error(errMsg + " - " + e1.getCallInfo());
            }
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Shutting down Content Service Engine ...");
        if (serviceEngine != null)
            serviceEngine.shutdown();
    }

    public static Map<String, ClientType> getClientInfo() {
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
        return authClient;
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

}
