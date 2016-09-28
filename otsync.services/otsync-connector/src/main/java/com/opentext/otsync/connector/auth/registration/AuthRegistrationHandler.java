package com.opentext.otsync.connector.auth.registration;

import com.opentext.otag.sdk.client.v3.AuthClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otsync.connector.OTSyncConnectorConstants;
import jersey.repackaged.com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Collections;
import java.util.Set;

/**
 * Appworks component that registers the {@code OTSyncAuthHandler} with the
 * Gateway service. It actually wraps a Thread that does this work as we don't expect
 * the connection URL we need to be setup immediately.
 * <p>
 * We also listen for changes to the one of the configuration settings the connector
 * defines, CS auth only, this flag forces us to re-register the connector, letting
 * the Gateway know whether it should involve OTDS when mapping incoming users names
 * to CS or send them through as is (CS auth only).
 *
 * @see RegisterAuthProviderThread
 * @see com.opentext.otsync.connector.auth.OTSyncAuthHandler
 */
public class AuthRegistrationHandler extends AbstractMultiSettingChangeHandler implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(AuthRegistrationHandler.class);

    /**
     * Did we manage to authorise the auth handler with the Gateway yet?
     */
    private boolean registeredAuth = false;

    private AuthClient identityServiceClient;

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

        registerAuthHandler();
    }

    @Override
    public Set<String> getSettingKeys() {
        return Sets.newHashSet(Collections.singletonList(OTSyncConnectorConstants.CS_URL));
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
