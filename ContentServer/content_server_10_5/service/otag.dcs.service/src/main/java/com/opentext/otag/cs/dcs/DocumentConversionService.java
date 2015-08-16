package com.opentext.otag.cs.dcs;

import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.services.client.TrustedProviderClient;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;

public class DocumentConversionService extends ContentServerAppworksServiceBase {

    private static SettingsClient settingsClient;
    private static TrustedProviderClient providerClient;

    @Override
    public void onStart(String appName) {
        settingsClient = new SettingsClient(appName);
        providerClient = new TrustedProviderClient(appName);
    }

    public static SettingsClient getSettingsClient() {
        return settingsClient;
    }

    public static TrustedProviderClient getProviderClient() {
        return providerClient;
    }

}
