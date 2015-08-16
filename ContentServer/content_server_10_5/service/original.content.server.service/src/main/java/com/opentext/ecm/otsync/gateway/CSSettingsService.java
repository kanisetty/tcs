package com.opentext.ecm.otsync.gateway;

import com.opentext.otag.api.services.client.SettingsClient;

/**
 * Manages the settings for the
 */
public class CSSettingsService {



    private SettingsClient settingsClient() {
        return GatewayServices.getSettingsClient();
    }
}
