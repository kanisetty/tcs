package com.opentext.otag.cs.service;

import com.opentext.otag.CSConstants;
import com.opentext.otag.api.services.AppworksServiceContextHandler;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.services.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.api.shared.types.message.SettingsChangeMessage;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.api.shared.types.settings.SettingType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

/**
 * Appworks service based that records and listens for updates to the Content server URL using
 * the supplied Appworks SDK tooling.
 */
public class ContentServerAppworksServiceBase extends AbstractSettingChangeHandler
        implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ContentServerAppworksServiceBase.class);

    public static final String STARTUP_FAILED = "Unable to retrieve a valid Content Server URL in Gateway " +
            "settings, please set the Content Server URL via the Content Service and reinstall this service";

    /**
     * Store the CS URL for the app
     */
    private static String csUrl = null;

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

    @Override
    public void onStart(String appName) {
        // the CS URL must be defined on startup of this kind of service
        SettingsClient settingsClient = new SettingsClient(appName);
        Setting csUrlSetting = settingsClient.getSetting(CSConstants.CONTENTSERVER_URL);
        if (csUrlSetting != null) {
            csUrl = csUrlSetting.getValue();
        } else {
            // this service is dependent on the CS URL being present in the Gateways config settings
            // we will react to the value been set while we are running though
            LOG.warn(STARTUP_FAILED);
        }
        LOG.info(this.getClass().getName() + " service started successfully");
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

}
