package com.opentext.otsync.tempocontent.rest;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otag.service.context.error.AWComponentNotFoundException;
import com.opentext.otsync.otag.AWComponentRegistry;
import com.opentext.otsync.otag.EIMConnectorHelper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class TempoContentService implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(TempoContentService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started Tempo Content Service");
        serviceClient = new ServiceClient();

        try {
            EIMConnectorClient csConnector = EIMConnectorHelper.getCurrentClient();
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                csConnection = connectionResult.getConnector();
                String connectionUrl = csConnection.getConnectionUrl();
                if (connectionUrl != null && !connectionUrl.isEmpty()) {
                    serviceClient.completeDeployment(new DeploymentResult(true));
                } else {
                    failBuild("OTSync EIM Connector was resolved but connection URL was not valid");
                }
            } else {
                failBuild("Failed to resolve the OTSync EIM " +
                        "connector, message=" + connectionResult.getMessage());
            }

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

    /**
     * Provide centralised public access to the connection URL we obtain from the
     * Content Server 16 connector.
     *
     * @return content server URL
     * @throws WebApplicationException 403, if we haven't managed to get a connection URL
     */
    public static String getCsUrl() {
        TempoContentService tempoContentService = AWComponentRegistry.getComponent(
                TempoContentService.class, "Tempo Content");

        String csUrl = tempoContentService.getCsConnection();

        if (csUrl == null || csUrl.isEmpty()) {
            LOG.error("Unable to resolve Content Server connection, all requests will be rejected");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        return csUrl;
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
