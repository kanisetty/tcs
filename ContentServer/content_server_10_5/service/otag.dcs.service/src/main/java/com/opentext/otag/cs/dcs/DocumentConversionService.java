package com.opentext.otag.cs.dcs;

import com.opentext.otag.api.services.client.ServiceClient;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.services.client.TrustedProviderClient;
import com.opentext.otag.api.services.connector.EIMConnectorClient;
import com.opentext.otag.api.services.connector.EIMConnectorClientImpl;
import com.opentext.otag.api.services.handlers.AppworksServiceContextHandler;
import com.opentext.otag.api.services.handlers.AppworksServiceStartupComplete;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DocumentConversionService  implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(DocumentConversionService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;
    private TrustedProviderClient trustedProviderClient;
    private SettingsClient settingsClient;

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started workflow service");
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

            trustedProviderClient = new TrustedProviderClient(appName);
            settingsClient = new SettingsClient(appName);
        } catch (Exception e) {
            failBuild("Failed to start Document Conversion Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Document Conversion Service has stopped");
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

    public TrustedProviderClient getProviderClient() {
        return trustedProviderClient;
    }

    public SettingsClient getSettingsClient() {
        return settingsClient;
    }

    /**
     * Return the instance of this service that was injected into the components context.
     *
     * @return THE instance of the DCS
     */
    public static DocumentConversionService getService() {
        DocumentConversionService service = AppworksComponentContext.getComponent(
                DocumentConversionService.class);
        if (service == null)
            throw new RuntimeException("Unable to resolve DocumentConversionService");
        return service;
    }

}
