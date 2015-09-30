package com.opentext.otag.cs.tasks;

import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
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
        serviceClient = new ServiceClient();

        try {
            EIMConnectorClient csConnector = new EIMConnectorClientImpl("ContentServer", "10.5");
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                csConnection = connectionResult.getConnector();

                String connectionUrl = csConnection.getConnectionUrl();
                LOG.info("Got a connection to Content Server 10.5, URL=" + connectionUrl);
                LOG.info("Connection details " + csConnection.toString());
                if (connectionUrl == null || connectionUrl.isEmpty())
                    failBuild("Managed to resolve Content Server connector but it did not have a " +
                            "valid URL connection String");
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
