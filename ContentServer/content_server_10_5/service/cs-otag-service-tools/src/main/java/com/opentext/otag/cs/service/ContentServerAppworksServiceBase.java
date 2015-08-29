package com.opentext.otag.cs.service;

import com.opentext.otag.CSConstants;
import com.opentext.otag.api.services.AppworksServiceContextHandler;
import com.opentext.otag.api.services.client.ServiceClient;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.services.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.api.services.handlers.AppworksServiceStartupComplete;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.message.SettingsChangeMessage;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.api.shared.types.settings.SettingType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

/**
 * Appworks abstract service base that records and listens for updates to the Content server URL using
 * the supplied Appworks SDK tooling. Simply subclass to get the basic features. Handlers of
 * this kind are picked up by the platform on deployment, hence it being abstract.
 *
 * NOTE!!!
 *
 * This class automatically completes the deployment process using the {@code ServiceClient} in its
 * onStart() method implementation, so if you have some startup work to do before this then
 * please be sure to carry this out before calling super.onStart() in your subclass.
 */
public abstract class ContentServerAppworksServiceBase extends AbstractSettingChangeHandler
        implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ContentServerAppworksServiceBase.class);

    public static final String STARTUP_FAILED = "Unable to retrieve a valid Content Server URL in Gateway " +
            "settings, please set the Content Server URL via the Content Service and reinstall this service";

    /**
     * Store the CS URL for the app
     */
    private static String csUrl = null;

    private ServiceClient serviceClient;

    public static String getCsUrl() {
        return csUrl;
    }

    @Override
    public String getSettingKey() {
        return CSConstants.CONTENTSERVER_URL;
    }

    @Override
    public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
        LOG.info("Updated CS URL setting to " + settingsChangeMessage.getNewValue());
        csUrl = settingsChangeMessage.getNewValue();
    }

    @AppworksServiceStartupComplete // promises to complete deployment
    @Override
    public void onStart(String appName) {
        LOG.info("ContentServerAppworksServiceBase onStart called");
        serviceClient = new ServiceClient(appName);
        // the CS URL must be defined on startup of this kind of service
        SettingsClient settingsClient = new SettingsClient(appName);
        Setting csUrlSetting = settingsClient.getSetting(CSConstants.CONTENTSERVER_URL);
        if (csUrlSetting != null) {
            csUrl = csUrlSetting.getValue();
        } else {
            // this service is dependent on the CS URL being present in the Gateways config settings
            // we will react to the value been set while we are running though
            LOG.warn(STARTUP_FAILED);
            completeDeployment(new DeploymentResult("CS URL was not available!"));
        }
        LOG.info(this.getClass().getName() + " service started successfully");
        completeDeployment(new DeploymentResult(true));
    }

    public static void validateCsUrl() {
        if (getCsUrl() == null) {
            LOG.error("Unable to resolve CS URL setting");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }
    }

    @Override
    public void onStop(String appName) {
        LOG.info("Shutting down "+ this.getClass().getName() + " service");
    }

    /**
     * We must let the Gateway know when we have been deployed successfully.
     *
     * @return true if we manage to relay our deployment status
     */
    protected boolean completeDeployment(DeploymentResult deploymentResult) {
        LOG.info("Issuing complete deployment result=" + deploymentResult.isSuccess());
        boolean result = serviceClient.completeDeployment(deploymentResult);
        if (result) {
            LOG.info("Deployment outcome was accepted by the Gateway");
        } else {
            LOG.warn("Failed to report deployment outcome");
        }
        return result;
    }

}
