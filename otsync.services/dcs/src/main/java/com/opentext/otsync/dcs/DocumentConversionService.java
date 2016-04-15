package com.opentext.otsync.dcs;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.service.context.components.AWComponentContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class DocumentConversionService implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(DocumentConversionService.class);

    private EIMConnector csConnection;
    private ServiceClient serviceClient;

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Started dcs service");
        serviceClient = new ServiceClient();

        try {
            EIMConnectorClient csConnector = new EIMConnectorClientImpl("OTSync", "16.0.0");
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
            failBuild("Failed to start Document Conversion Service, " + e.getMessage());
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Document Conversion Service has stopped");
    }

    public static String getCsUrl() {
        DocumentConversionService service = AWComponentContext.getComponent(
                DocumentConversionService.class);
        if (service == null) {
            LOG.error("Failed to resolve DocumentConversionService, so cannot get Content Server connection");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        String csConnectionUrl = service.getCsConnection();

        if (csConnectionUrl == null || csConnectionUrl.isEmpty()) {
            LOG.error("Content Server connection was not defined");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        return csConnectionUrl;
    }

    public String getCsConnection() {
        return csConnection.getConnectionUrl();
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

    /**
     * Return the instance of this service that was injected into the components context.
     *
     * @return THE instance of the DCS
     */
    public static DocumentConversionService getService() {
        DocumentConversionService service = AWComponentContext.getComponent(
                DocumentConversionService.class);
        if (service == null)
            throw new RuntimeException("Unable to resolve DocumentConversionService");
        return service;
    }

}
