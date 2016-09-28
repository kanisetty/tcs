package com.opentext.otsync.connector.auth.registration;

import com.opentext.otag.sdk.client.v3.AuthClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.auth.AuthHandler;
import com.opentext.otag.sdk.types.v3.auth.RegisterAuthHandlersRequest;
import com.opentext.otag.sdk.types.v3.settings.Setting;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otag.service.context.error.AWComponentNotFoundException;
import com.opentext.otsync.connector.OTSyncConnectorConstants;
import com.opentext.otsync.connector.auth.OTSyncAuthHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * In order to resolve the OTDS resource id that we are interested in (for username
 * mapping) we need the CS url to be defined correctly. Register our auth handler
 * when we know we can build the AuthProvider with the OTDS resource id.
 **/
public class RegisterAuthProviderThread extends Thread {

    private static final Log LOG = LogFactory.getLog(RegisterAuthProviderThread.class);

    private AuthRegistrationHandler registrationHandler;
    private AuthClient identityServiceClient;
    private OTSyncAuthHandler csAuthHandler;

    private boolean keepRunning = true;

    public RegisterAuthProviderThread(AuthRegistrationHandler registrationHandler,
                                      AuthClient identityServiceClient) {
        super("Register CS auth providers Thread");
        this.registrationHandler = registrationHandler;
        this.identityServiceClient = identityServiceClient;

        try {
            csAuthHandler = AWComponentContext.getComponent(OTSyncAuthHandler.class);
        } catch (AWComponentNotFoundException e) {
            throw new RuntimeException("Failed to create RegisterAuthProviderThread", e);
        }
    }

    @Override
    public void run() {
        LOG.info("Starting CS auth handler registration Thread");

        while (keepRunning) {
            try {
                // the OTDS resource id will be resolved as part of the base build method so we can check it
                AuthHandler handler = csAuthHandler.buildHandler();

                RegisterAuthHandlersRequest registerAuthHandlersRequest = new RegisterAuthHandlersRequest();
                // ask our parent for the current value (it listens)
                String otdsResourceId = handler.getOtdsResourceId();

                if (otdsResourceId != null) {
                    LOG.info("OTDS Resource Id was populated, issuing registration request to Gateway");
                    if (!issueRequest(handler, registerAuthHandlersRequest)) {
                        LOG.info("Failed to register auth handler, please review the logs at " +
                                "managing Gateway, sleeping ...");
                        sleep();
                    } else {
                        // set the read-only setting value
                        updateOtdsResourceIdSetting(otdsResourceId);

                        // let the connector know we are done
                        registrationHandler.setRegisteredAuth(true);
                        keepRunning = false;
                        LOG.info("Registered CS Auth handler with Gateway");
                    }
                } else {
                    LOG.info("Still unable to resolve OTDS resource id, sleeping ...");
                    sleep();
                }
            } catch (APIException e) {
                LOG.info("Failed to retrieve OTDS resource id - " + e.getCallInfo());
                sleep();
            }
        }
    }

    private void updateOtdsResourceIdSetting(String otdsResourceId) {
        LOG.info("Attempting to update OTDS resource id setting to " + otdsResourceId);
        try {
            SettingsClient settingsClient = new SettingsClient();
            Setting otdsResId = settingsClient.getSetting(OTSyncConnectorConstants.OTDS_RES_ID);
            if (otdsResId != null) {
                otdsResId.setValue(otdsResourceId);
                SDKResponse updateSetting = settingsClient.updateSetting(otdsResId);
                if (updateSetting.isSuccess()) {
                    LOG.info("Successfully set OTDS resource id setting");
                } else {
                    LOG.warn("Failed to update setting " + OTSyncConnectorConstants.OTDS_RES_ID +
                            " to value " + otdsResourceId);
                }
            } else {
                LOG.warn("Failed to lookup setting " + OTSyncConnectorConstants.OTDS_RES_ID +
                        " and cannot update value to " + otdsResourceId);
            }
        } catch (Exception e) {
            LOG.error("Failed to update OTDS resource id due to some unexpected " +
                    "error, " + e.getMessage(), e);
        }
    }

    public void shutdown() {
        try {
            LOG.info("Shutting down " + this.getName());
            keepRunning = false;
            this.interrupt();
        } catch (Exception e) {
            LOG.error("Shutdown for " + this.getName() + " did not complete " +
                    "successfully, " + e.getMessage(), e);
        }
    }

    private boolean issueRequest(AuthHandler handler,
                                 RegisterAuthHandlersRequest registerAuthHandlersRequest) throws APIException {
        registerAuthHandlersRequest.addHandler(handler);
        SDKResponse sdkResponse = identityServiceClient.registerAuthHandlers(registerAuthHandlersRequest);
        return sdkResponse.isSuccess();
    }

    private void sleep() {
        try {
            Thread.sleep(20 * 1000);
        } catch (InterruptedException ignored) {
        }
    }

}
