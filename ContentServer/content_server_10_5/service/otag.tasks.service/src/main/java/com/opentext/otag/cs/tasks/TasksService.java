package com.opentext.otag.cs.tasks;

import com.opentext.otag.api.services.client.ServiceClient;
import com.opentext.otag.api.services.connector.EIMConnectorClient;
import com.opentext.otag.api.services.connector.EIMConnectorClientImpl;
import com.opentext.otag.api.services.handlers.AppworksServiceContextHandler;
import com.opentext.otag.api.services.handlers.AppworksServiceStartupComplete;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class TasksService implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(TasksService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started Tasks service");
        serviceClient = new ServiceClient(appName);

        try {
            EIMConnectorClient csConnector = new EIMConnectorClientImpl(appName, "ContentServer", "10.5");
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                csConnection = connectionResult.getConnector();
            } else {
                failBuild("Failed to resolve the Content Server EIM " +
                        "connector, message=" + connectionResult.getMessage());
            }

            serviceClient.completeDeployment(new DeploymentResult(true));
        } catch (Exception e) {
            failBuild("Failed to start Tasks Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Workflow Service has stopped");
    }

    public String getCsConnection() {
        return (csConnection != null) ? csConnection.getConnectionUrl() : null;
    }

    private void failBuild(String errMsg) {
        LOG.error(errMsg);
        if (!serviceClient.completeDeployment(new DeploymentResult(errMsg))) {
            LOG.error("Failed to report deployment outcome to the Gateway");
        }
    }

}
