package com.opentext.otag.cs.connector.auth.registration;

import com.opentext.otag.api.services.client.IdentityServiceClient;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.shared.types.auth.AuthHandler;
import com.opentext.otag.api.shared.types.auth.RegisterAuthHandlersRequest;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.cs.connector.CsConnectorConstants;
import com.opentext.otag.cs.connector.auth.ContentServerAuthHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * In order to resolve the OTDS resource id that we are interested in (for username
 * mapping) we need the CS url to be defined correctly. Register our auth handler
 * when we know we can build the AuthProvider with the OTDS resource id, unless we
 * are only interested in CS Auth only.
 *
 * @see com.opentext.otag.cs.connector.CsConnectorConstants#CS_AUTH_ONLY
 */
public class RegisterAuthProviderThread extends Thread {

    private static final Log LOG = LogFactory.getLog(RegisterAuthProviderThread.class);

    private AuthRegistrationHandler registrationHandler;
    private IdentityServiceClient identityServiceClient;
    private ContentServerAuthHandler csAuthHandler;

    private boolean keepRunning = true;

    public RegisterAuthProviderThread(AuthRegistrationHandler registrationHandler,
                                      IdentityServiceClient identityServiceClient) {
        super("Register CS auth providers Thread");
        this.registrationHandler = registrationHandler;
        this.identityServiceClient = identityServiceClient;

        csAuthHandler = AppworksComponentContext.getComponent(ContentServerAuthHandler.class);
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
                boolean csAuthOnly = registrationHandler.isCsAuthOnly();
                if (!csAuthOnly) {
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
                } else {
                    LOG.info("CS auth only detected, issuing registration request to Gateway");
                    // ignore OTDS resource for CS only auth
                    handler = new AuthHandler(handler.getHandler(),
                            handler.isDecorator(),
                            handler.getKnownCookies());

                    issueRequest(handler, registerAuthHandlersRequest);
                    keepRunning = false;
                }
            } catch (Exception e) {
                LOG.info("Failed to retrieve OTDS resource id");
                sleep();
            }
        }
    }

    private void updateOtdsResourceIdSetting(String otdsResourceId) {
        LOG.info("Attempting to update OTDS resource id setting to " + otdsResourceId);
        try {
            SettingsClient settingsClient = new SettingsClient();
            Setting otdsResId = settingsClient.getSetting(CsConnectorConstants.OTDS_RES_ID);
            if (otdsResId != null) {
                otdsResId.setValue(otdsResourceId);
                if (settingsClient.updateSetting(otdsResId)) {
                    LOG.info("Successfully set OTDS resource id setting");
                } else {
                    LOG.warn("Failed to update setting " + CsConnectorConstants.OTDS_RES_ID +
                            " to value " + otdsResourceId);
                }
            } else {
                LOG.warn("Failed to lookup setting " + CsConnectorConstants.OTDS_RES_ID +
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
            LOG.error("Shutdown for "  + this.getName() + " did not complete " +
                    "successfully, " + e.getMessage(), e);
        }
    }

    private boolean issueRequest(AuthHandler handler,
                              RegisterAuthHandlersRequest registerAuthHandlersRequest) {
        registerAuthHandlersRequest.addHandler(handler);
        return identityServiceClient.registerAuthHandlers(registerAuthHandlersRequest);
    }

    private void sleep() {
        try {
            Thread.sleep(20 * 1000);
        } catch (InterruptedException ignored) {}
    }

}
