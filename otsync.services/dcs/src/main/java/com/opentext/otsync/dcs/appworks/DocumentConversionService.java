package com.opentext.otsync.dcs.appworks;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.dcs.cache.DocumentConversionFileCache;
import com.opentext.otsync.otag.EIMConnectorHelper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@SuppressWarnings("unused")
public class DocumentConversionService implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(DocumentConversionService.class);

    private ServiceClient serviceClient;
    private SettingsClient settingsClient;

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started dcs service");
        serviceClient = new ServiceClient();
        settingsClient = new SettingsClient();
        try {
            EIMConnectorClient csConnector = EIMConnectorHelper.getDefaultClient();
            // setup our AW service components
            setupComponents(csConnector);

            // resolve connection
            EIMConnectorClient.ConnectionResult connectionResult = csConnector.connect();
            if (connectionResult.isSuccess()) {
                EIMConnector csConnection = connectionResult.getConnector();
                String connectionUrl = csConnection.getConnectionUrl();
                if (connectionUrl != null && !connectionUrl.isEmpty()) {
                    serviceClient.completeDeployment(new DeploymentResult(true));
                } else {
                    failBuild("OTSync EIM Connector was resolved but connection URL was not valid");
                }
            } else {
                failBuild("Failed to resolve the OTSync EIM connector, message=" +
                        connectionResult.getMessage());
            }
        } catch (Exception e) {
            failBuild("Failed to start Document Conversion Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Document Conversion Service has stopped");
    }

    private void setupComponents(EIMConnectorClient csConnector) {
        SettingsService settingsService = new SettingsService(settingsClient);
        DocumentConversionFileCache docCache = new DocumentConversionFileCache(settingsService);
        ContentServerURLProvider csUrlProvider = new ContentServerURLProviderImpl(csConnector);

        // make them accessible to other parts of the service via the context
        AWComponentContext.add(settingsService, docCache, csUrlProvider);
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
