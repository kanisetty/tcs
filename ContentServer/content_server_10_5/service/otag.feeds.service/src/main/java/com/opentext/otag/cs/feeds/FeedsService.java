package com.opentext.otag.cs.feeds;

import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;

public class FeedsService extends ContentServerAppworksServiceBase {

    // Gateway Settings API client
    private static SettingsClient settingsClient;

    /**
     * Initialise the FeedsService, our parent class will have setup the CS URL or
     * failed at this point if it cannot resolve that String.
     *
     * @param appName the name of this app as known by the Gateway
     */
    @Override
    public void onStart(String appName) {
        super.onStart(appName);
        settingsClient = new SettingsClient(appName);
    }

    public static SettingsClient getSettingsClient() {
        return settingsClient;
    }

}
