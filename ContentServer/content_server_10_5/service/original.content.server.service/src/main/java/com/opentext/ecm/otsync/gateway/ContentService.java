package com.opentext.ecm.otsync.gateway;

import com.opentext.otag.api.services.AppworksServiceContextHandler;

public class ContentService implements AppworksServiceContextHandler {
    @Override
    public void onStart(String appName) {
        GatewayServices.init(appName);

        // TODO FIXME Manage settings from here I reckon
    }

    @Override
    public void onStop(String appName) {

    }
}
