package com.opentext.otsync.dcs.appworks;

import com.opentext.otag.sdk.connector.EIMConnectorClient;

public class ContentServerURLProviderImpl implements ContentServerURLProvider {

    /**
     * Retain the Content Server connector client, it will get updated when the connection value.
     */
    private final EIMConnectorClient csConnector;

    public ContentServerURLProviderImpl(EIMConnectorClient csConnector) {
        this.csConnector = csConnector;
    }

    @Override
    public String getContentServerUrl() {
        return this.csConnector.getConnectionString();
    }

}
