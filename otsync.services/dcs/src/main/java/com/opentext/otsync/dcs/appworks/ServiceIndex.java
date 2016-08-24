package com.opentext.otsync.dcs.appworks;

import com.opentext.otsync.dcs.cache.DocumentConversionFileCache;
import com.opentext.otsync.otag.AWComponentRegistry;

public class ServiceIndex {

    private static final String SERVICE_NAME = "Document Conversion Service";

    public static ContentServerURLProvider getCSUrlProvider() {
        return AWComponentRegistry.getComponent(ContentServerURLProviderImpl.class, SERVICE_NAME);
    }

    public static SettingsService getSettingsService() {
        return AWComponentRegistry.getComponent(SettingsService.class, SERVICE_NAME);
    }

    public static DocumentConversionFileCache getFileCacheService() {
        return AWComponentRegistry.getComponent(DocumentConversionFileCache.class, SERVICE_NAME);
    }
}
