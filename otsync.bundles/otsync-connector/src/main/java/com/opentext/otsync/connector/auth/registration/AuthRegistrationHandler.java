package com.opentext.otsync.connector.auth.registration;

import com.opentext.otag.sdk.client.AuthClient;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import jersey.repackaged.com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.opentext.otsync.connector.OTSyncConnectorConstants;

import java.util.Arrays;
import java.util.Set;

/**
 * Appworks component that registers the {@code TempoAuthHandler} with the
 * Gateway service. It actually wraps a Thread that does this work as we don't expect
 * the connection URL we need to be setup immediately.
 * <p>
 * We also listen for changes to the one of the configuration settings the connector
 * defines, CS auth only, this flag forces us to re-register the connector, letting
 * the Gateway know whether it should involve OTDS when mapping incoming users names
 * to CS or send them through as is (CS auth only).
 *
 * @see RegisterAuthProviderThread
 * @see com.opentext.otsync.connector.auth.TempoAuthHandler
 */
public class AuthRegistrationHandler extends AbstractMultiSettingChangeHandler implements AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(AuthRegistrationHandler.class);

    /**
     * Did we manage to authorise the auth handler with the Gateway yet?
     */
    private boolean registeredAuth = false;

    /**
     * We listen for changes to this setting. When CS auth only is true we don't bother
     * asking OTDS to provide username mapping for login via credentials.
     */
    private boolean csAuthOnly = false;

    AuthClient identityServiceClient;

    /**
     * This thread will register the OTSyncAuthHandler with the Gateway, it will do
     * so immediately if we are using CS Auth only but will wait to connect to CS (via the connector
     * URL) to grab the OTDS resourceId that it needs to register to get the OTDS username mapping
     * to work (OTDS + CS Auth).
     */
    private RegisterAuthProviderThread registerAuthProviderThread;

    @Override
    public void onStart(String appName) {
        LOG.info("Started AuthRegistrationHandler");
        identityServiceClient = new AuthClient();

        LOG.info("Adding handlers for CS URL and CS AUTH ONLY");
        addHandler(OTSyncConnectorConstants.CS_URL, (s) -> {
            LOG.info("CS url setting was updated, re-register CS Auth provider");
            registerAuthHandler();
        });
        addHandler(OTSyncConnectorConstants.CS_AUTH_ONLY, (s) -> {
            LOG.info("CS auth only setting was updated, re-register CS Auth provider");
            registerAuthHandler();
            try {
                csAuthOnly = Boolean.valueOf(s.getNewValue());
            } catch (Exception e) {
                LOG.error("Failed to resolve CS Auth only into Boolean", e);
            }
        });

        registerAuthHandler();
    }

    @Override
    public Set<String> getSettingKeys() {
        return Sets.newHashSet(Arrays.asList(OTSyncConnectorConstants.CS_URL, OTSyncConnectorConstants.CS_AUTH_ONLY));
    }

    @Override
    public void onStop(String appName) {
        if (registerAuthProviderThread != null && registerAuthProviderThread.isAlive())
            registerAuthProviderThread.shutdown();
    }

    public boolean isAuthRegistered() {
        return registeredAuth;
    }

    public void setRegisteredAuth(boolean registeredAuth) {
        this.registeredAuth = registeredAuth;
    }

    public boolean isCsAuthOnly() {
        return csAuthOnly;
    }

    private void registerAuthHandler() {
        LOG.info("Attempting to launch registration Thread");
        if (registerAuthProviderThread != null && registerAuthProviderThread.isAlive()) {
            LOG.warn("Registration thread was running, shutting down!");
            registerAuthProviderThread.shutdown();
        }

        // run the register
        registerAuthProviderThread = new RegisterAuthProviderThread(this, identityServiceClient);
        registerAuthProviderThread.start();
    }

}
