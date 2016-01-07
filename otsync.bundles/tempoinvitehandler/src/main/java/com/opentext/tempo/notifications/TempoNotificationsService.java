package com.opentext.tempo.notifications;

import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import com.opentext.otag.sdk.client.AuthClient;
import com.opentext.otag.sdk.client.MailClient;
import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class TempoNotificationsService implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(TempoNotificationsService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    private AuthClient authClient;
    private SettingsClient settingsClient;
    private MailClient mailClient;

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started Tempo Notifications service");
        serviceClient = new ServiceClient();
        settingsClient = new SettingsClient();
        authClient = new AuthClient();
        mailClient = new MailClient();

        try {
            EIMConnectorClient csConnector = new EIMConnectorClientImpl("OTSync", "16.0.0");
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                csConnection = connectionResult.getConnector();
            } else {
                failBuild("Failed to resolve the OTSync EIM " +
                        "connector, message=" + connectionResult.getMessage());
            }

            serviceClient.completeDeployment(new DeploymentResult(true));
        } catch (Exception e) {
            failBuild("Failed to start Tempo Notifications Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Tempo Notifications Service has stopped");
    }

    public SettingsClient getSettingsClient() {
        return settingsClient;
    }

    public AuthClient getAuthClient() {
        return authClient;
    }

    public MailClient getMailClient() {
        return mailClient;
    }

    public String getCsConnection() {
        return (csConnection != null) ? csConnection.getConnectionUrl() : null;
    }

    public static String getCsUrl() {
        TempoNotificationsService tempoNotificationsService = AppworksComponentContext.getComponent(TempoNotificationsService.class);

        if (tempoNotificationsService != null) {
            String csConnection = tempoNotificationsService.getCsConnection();
            if (csConnection != null)
                return csConnection;
        }

        LOG.error("Unable to service tempo notifications request, unable to get CS connection URL");
        throw new WebApplicationException(Response.Status.FORBIDDEN);
    }

    private void failBuild(String errMsg) {
        LOG.error(errMsg);
        if (!serviceClient.completeDeployment(new DeploymentResult(errMsg))) {
            LOG.error("Failed to report deployment outcome to the Gateway");
        }
    }
}
