package com.opentext.otag.rest.tempocontent;

import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class TempoContentService implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(TempoContentService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started Tempo Content Service");
        serviceClient = new ServiceClient();

        try {
            EIMConnectorClient csConnector = new EIMConnectorClientImpl("ContentServer", "16");
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                csConnection = connectionResult.getConnector();
            } else {
                failBuild("Failed to resolve the Content Server EIM " +
                        "connector, message=" + connectionResult.getMessage());
            }

            serviceClient.completeDeployment(new DeploymentResult(true));
        } catch (Exception e) {
            failBuild("Failed to start Tempo Content Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Tempo Content Service has stopped");
    }

    public String getCsConnection() {
        return (csConnection != null) ? csConnection.getConnectionUrl() : null;
    }

    public static TempoContentService getService() {
        TempoContentService tempoContentService = AppworksComponentContext.getComponent(TempoContentService.class);
        if (tempoContentService == null)
            throw new RuntimeException("Unable to resolve Tempo Content Service");

        return tempoContentService;
    }

    /**
     * Provide centralised public access to the connection URL we obtain from the
     * Content Server 16 connector.
     *
     * @return content server URL
     * @throws WebApplicationException 403, if we haven't managed to get a connection URL
     */
    public static String getCsUrl() {

        TempoContentService tempoContentService = AppworksComponentContext.getComponent(TempoContentService.class);

        if (tempoContentService == null) {
            LOG.error("Unable to resolve Tempo Content Service, unable to get Content Server connection");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }
        String csUrl = tempoContentService.getCsConnection();

        if (csUrl == null || csUrl.isEmpty()) {
            LOG.error("Unable to resolve Content Server connection, all requests will be rejected");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        return csUrl;
    }

    private void failBuild(String errMsg) {
        LOG.error(errMsg);
        if (!serviceClient.completeDeployment(new DeploymentResult(errMsg))) {
            LOG.error("Failed to report deployment outcome to the Gateway");
        }
    }

}
