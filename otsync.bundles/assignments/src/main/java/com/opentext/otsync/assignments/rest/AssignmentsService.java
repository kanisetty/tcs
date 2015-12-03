package com.opentext.otsync.assignments.rest;

import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class AssignmentsService implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(AssignmentsService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started workflow service");
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
            failBuild("Failed to start Assignments Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Assignments Service has stopped");
    }

    public String getCsConnection() {
        return (csConnection != null) ? csConnection.getConnectionUrl() : null;
    }

    public static String getCsUrl() {
        AssignmentsService assignmentsService = AppworksComponentContext.getComponent(AssignmentsService.class);

        if (assignmentsService != null) {
            String csConnection = assignmentsService.getCsConnection();
            if (csConnection != null)
                return csConnection;
        }

        LOG.error("Unable to service assignments request, unable to get CS connection URL");
        throw new WebApplicationException(Response.Status.FORBIDDEN);
    }

    private void failBuild(String errMsg) {
        LOG.error(errMsg);
        if (!serviceClient.completeDeployment(new DeploymentResult(errMsg))) {
            LOG.error("Failed to report deployment outcome to the Gateway");
        }
    }
}
