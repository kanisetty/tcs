package com.opentext.otsync.workflow.rest;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient.ConnectionResult;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.otag.EIMConnectorHelper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class WorkflowAppworksService implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(WorkflowAppworksService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started workflow service");
        serviceClient = new ServiceClient();

        try {
            EIMConnectorClient csConnector = EIMConnectorHelper.getCurrentClient();
            ConnectionResult connectionResult = csConnector.connect();
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
            failBuild("Failed to start Workflow Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Workflow Service has stopped");
    }

    public String getCsConnection() {
        return (csConnection != null) ? csConnection.getConnectionUrl() : null;
    }

    /**
     * Resolve the Content Server using the workflow service as it manages the EIM Connector.
     *
     * @return content server URL
     * @throws WebApplicationException 403 if we cannot resolve the connector URL
     */
    public static String getCsUrl() {

        WorkflowAppworksService workflowService = AWComponentContext.getComponent(WorkflowAppworksService.class);

        if (workflowService != null) {
            String csConnection = workflowService.getCsConnection();
            if (csConnection != null)
                return csConnection;
        }

        LOG.error("Unable to resolve Content Server connection, all requests will be rejected");
        throw new WebApplicationException(Response.Status.FORBIDDEN);
    }

    private void failBuild(String errMsg) {
        String unableToReportOutcome = "Failed to report deployment outcome to the Gateway - ";
        try {
            LOG.error(errMsg);
            SDKResponse deploymentResp = serviceClient.completeDeployment(new DeploymentResult(unableToReportOutcome));
            if (!deploymentResp.isSuccess()) {
                LOG.error(unableToReportOutcome + deploymentResp.getSdkCallInfo());
            }
        } catch (APIException e) {
            LOG.error(unableToReportOutcome + e.getCallInfo());
        }
    }

}
