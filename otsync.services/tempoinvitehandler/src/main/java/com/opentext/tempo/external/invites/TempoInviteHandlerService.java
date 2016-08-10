package com.opentext.tempo.external.invites;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient.ConnectionResult;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.sdk.util.StringUtil;
import com.opentext.otsync.otag.EIMConnectorHelper;
import com.opentext.tempo.external.invites.appworks.settings.SettingsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TempoInviteHandlerService implements AWServiceContextHandler {

    private static final Logger LOG = LoggerFactory.getLogger(TempoInviteHandlerService.class);

    // AppWorks SDK clients
    private ServiceClient serviceClient;
    private SettingsClient settingsClient;

    /**
     * This is our connection to content server, it retains the CS URL and
     * keeps its value up to date (it can be changed by a Gateway admin).
     */
    private EIMConnectorClient csConnector;

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started Tempo External Invites service");
        serviceClient = new ServiceClient();
        settingsClient = new SettingsClient();

        try {
            csConnector = EIMConnectorHelper.getCurrentClient();
            ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                EIMConnector csConnection = connectionResult.getConnector();
                // we get the connection URL from the connect result
                String connectionUrl = csConnection.getConnectionUrl();

                if (!StringUtil.isNullOrEmpty(connectionUrl)) {
                    LOG.info("Initialising settings for the invite handler service");
                    SettingsBuilder settingsBuilder = new SettingsBuilder(settingsClient);
                    settingsBuilder.initServiceSettings();

                    serviceClient.completeDeployment(new DeploymentResult(true));
                } else {
                    failBuild("OTSync EIM Connector was resolved but connection URL was not valid");
                }
            } else {
                failBuild("Failed to resolve the OTSync EIM " +
                        "connector, message=" + connectionResult.getMessage());
            }
        } catch (Exception e) {
            if (e instanceof APIException)
                LOG.error("SDK call failed during deployment - {}",
                        ((APIException) e).getCallInfo());
            failBuild("Failed to start Tempo Invite Handler Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Tempo Notifications Service has stopped");
    }

    public boolean isReady() {
        // ensure onStart was called
        return serviceClient != null;
    }

    public SettingsClient getSettingsClient() {
        return settingsClient;
    }

    public String getCsConnection() {
        // get latest connection URL value
        return (csConnector != null) ? csConnector.getConnectionString() : null;
    }

    private void failBuild(String errMsg) {
        String reportFailureMsg = "Failed to report deployment outcome to the Gateway";
        try {
            LOG.error(errMsg);
            SDKResponse sdkResponse = serviceClient.completeDeployment(new DeploymentResult(errMsg));
            if (!sdkResponse.isSuccess()) {
                LOG.error(reportFailureMsg);
            }
        } catch (APIException e) {
            LOG.error(errMsg + " - " + e.getCallInfo());
        }
    }
}
