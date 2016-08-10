package com.opentext.otsync.otag;

import com.opentext.otag.sdk.connector.EIMConnectorClient;
import com.opentext.otag.sdk.connector.EIMConnectorClientImpl;

public class EIMConnectorHelper {

    public static final String CS_CONNECTOR_NAME = "OTSync";
    public static final String CS_CONNECTOR_VERSION = "16.0.1";

    public static EIMConnectorClient getCurrentClient() {
        return new EIMConnectorClientImpl(CS_CONNECTOR_NAME, CS_CONNECTOR_VERSION);
    }

}
