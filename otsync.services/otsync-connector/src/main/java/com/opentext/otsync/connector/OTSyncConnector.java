package com.opentext.otsync.connector;

import com.opentext.otag.sdk.client.v3.ServiceClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.connector.EIMConnectorService;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AWServiceStartupComplete;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.handlers.AuthRequestHandler;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otag.sdk.types.v3.api.SDKResponse;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.auth.AuthHandlerResult;
import com.opentext.otag.sdk.types.v3.client.ClientRepresentation;
import com.opentext.otag.sdk.types.v3.management.DeploymentResult;
import com.opentext.otag.sdk.types.v3.sdk.EIMConnector;
import com.opentext.otag.sdk.types.v3.settings.Setting;
import com.opentext.otag.sdk.util.Cookie;
import com.opentext.otag.sdk.util.ForwardHeaders;
import com.opentext.otsync.connector.auth.OTSyncAuthHandler;
import com.opentext.otsync.connector.auth.registration.AuthRegistrationHandler;
import com.opentext.otsync.connector.auth.trustedprovider.TrustedServerKeyRegistrationHandler;
import com.opentext.otsync.otag.EIMConnectorHelper;
import com.opentext.otsync.rest.util.LLCookie;
import jersey.repackaged.com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;
import static com.opentext.otag.service.context.components.AWComponentContext.getComponent;

/**
 * OTSync EIM Connector.
 * <p>
 * This connector provides information on how to connect to a Content Server
 * instance, and also registers the OTSync authentication handler.
 * <p>
 * It also attempts to register a Trusted Provider key with the
 * Gateway. Retrieving/generating a key via the Gateway is simple but in order
 * to get the key into Content Server we need a valid LLCookie. This means we
 * have to have some valid credentials to use with our OTSync auth handler.
 * We therefore include some configuration settings to allow the user to enter
 * these details.
 */
public class OTSyncConnector extends AbstractMultiSettingChangeHandler
        implements EIMConnectorService, AWServiceContextHandler {

    private static final ThreadSafeClientConnManager connectionManager = new ThreadSafeClientConnManager();
    private static final Log LOG = LogFactory.getLog(OTSyncConnector.class);

    public static final String CS_COOKIE_NAME = "LLCookie";
    private static final String HTTP_REFERER_HEADER = "REFERER";

    private DefaultHttpClient httpClient;

    /**
     * The Content Server URL is managed as a config setting in the Gateway, it can
     * be set in the administration UI.
     */
    private String csUrl;

    // user credentials this service needs to establish a trusted provider key
    private String csAdminUser;
    private String csAdminPassword;

    private String trustedServerKey;
    private SettingsClient settingsClient;

    /**
     * Default no-args constructor used by the Appworks Framework.
     */
    public OTSyncConnector() {
        httpClient = new DefaultHttpClient(connectionManager);
    }

    @AWServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Starting OTSyncConnector EIM connector");

        settingsClient = new SettingsClient();

        ServiceClient serviceClient = new ServiceClient();
        TrustedProviderClient trustedProviderClient = new TrustedProviderClient();

        try {
            TrustedProvider connectorProvider = trustedProviderClient.getOrCreate(getTrustedProviderName());
            if (connectorProvider != null) {
                trustedServerKey = connectorProvider.getKey();
            } else {
                String errMsg = "We failed to retrieve a provider key from the Gateway";
                serviceClient.completeDeployment(new DeploymentResult(errMsg));
                LOG.error(errMsg);
                return;
            }

            // see if we have stored our settings already
            resolveSettings();

            // listen for changes to our settings
            registerSettingHandlers();

            EIMConnector eimConnector = new EIMConnector(getConnectorName(), getConnectorVersion(),
                    getConnectionString(), getConnectionStringSettingKey(),
                    getTrustedProviderName(), getTrustedProviderKey());

            SDKResponse registerConnector = serviceClient.registerConnector(eimConnector);
            if (registerConnector.isSuccess()) {
                // tell the Gateway we have finished deploying
                serviceClient.completeDeployment(new DeploymentResult(true));
            } else {
                String errMsg = "Failed to register the OTSync Connector with the Gateway";
                LOG.error(errMsg);
                serviceClient.completeDeployment(new DeploymentResult(errMsg));
            }
        } catch (APIException e) {
            String errMsg = "Failed to start the OTSync " + "Connector with the Gateway, " + e.getMessage();
            LOG.error(errMsg, e);
            try {
                serviceClient.completeDeployment(new DeploymentResult(errMsg));
            } catch (APIException e1) {
                LOG.error("Could not report outcome of deployment - " + e1.getCallInfo());
            }
        }

    }

    @Override
    public void onStop(String appName) {
        LOG.info("Stopped OTSyncConnector EIM connector");
    }

    @Override
    public String getConnectorName() {
        return EIMConnectorHelper.CS_CONNECTOR_NAME;
    }

    @Override
    public String getConnectorVersion() {
        return EIMConnectorHelper.CS_CONNECTOR_VERSION;
    }

    @Override
    public String getConnectionString() {
        return csUrl;
    }

    @Override
    public String getConnectionStringSettingKey() {
        return OTSyncConnectorConstants.CS_URL;
    }

    @Override
    public String getTrustedProviderName() {
        return "OTSync";
    }

    @Override
    public String getTrustedProviderKey() {
        return trustedServerKey;
    }

    @Override
    public boolean registerTrustedProviderKey(String serverName, String key) {
        String connectionString = getConnectionString();

        LLCookie llCookie = getLLCookie(csAdminUser, csAdminPassword);

        if (llCookie == null) {
            LOG.warn("Unable to resolve CS token, we wont be able to register the Trusted Provider key");
            return false;
        }

        try {
            if (connectionString != null) {
                ArrayList<NameValuePair> params = new ArrayList<>();

                params.add(new BasicNameValuePair("func", "otsync.settings"));
                params.add(new BasicNameValuePair("sharedKey", key));

                // Also use the configured otag url for this server to set up communications
                // from the otsync notifier, and redirects for Tempo Box
                String otagUrl = getOtagUrl();
                if (isNullOrEmpty(otagUrl)) {
                    throw new RuntimeException("Unable to resolve OTAG URL setting, and cannot therefore tell the " +
                            "otsync module about its value. OTSync services may not work if this is the case");
                } else {
                    params.add(new BasicNameValuePair("engine", otagUrl));
                }

                params.add(new BasicNameValuePair("destination_uri", otagUrl));

                HttpPost request = new HttpPost(csUrl);
                request.setEntity(new UrlEncodedFormEntity(params));
                request.addHeader(HTTP_REFERER_HEADER, csUrl);

                llCookie.addLLCookieToRequest(httpClient, request);

                // ForwardHeaders instance was passed here
                // headers.addTo(req);
                HttpResponse response = httpClient.execute(request);

                int statusCode = response.getStatusLine().getStatusCode();

                if (statusCode == HttpStatus.SC_MOVED_TEMPORARILY) {
                    // 302 is the llrequesthandler's way of failing auth
                    LOG.error("We failed to set the trusted server key as Content Server told " +
                            "us the cs token we provided was not valid");
                } else if (statusCode != HttpStatus.SC_OK) {
                    LOG.error("We failed to register the trusted server key, statusCode=" + statusCode);
                }

                return true;
            }
        } catch (IOException e) {
            LOG.error("We failed to contact Content Server to register " +
                    "the trusted provider key", e);
        }

        return false;
    }

    private LLCookie getLLCookie(String csAdminUser, String csAdminPassword) {

        if (isAuthRegistered()) {
            if (csAdminUser != null && !csAdminUser.isEmpty() &&
                    csAdminPassword != null && !csAdminPassword.isEmpty()) {
                OTSyncAuthHandler authHandler = (OTSyncAuthHandler) getAuthHandler();
                AuthHandlerResult result = authHandler.auth(csAdminUser, csAdminPassword,
                        new ForwardHeaders(), new ClientRepresentation());
                Map<String, Cookie> cookies = result.getCookies();

                return new LLCookie(cookies);
            } else {
                LOG.info("The Content Server credentials have not been set yet so we " +
                        "cannot attempt to retrieve a cs token");
            }
        } else {
            LOG.info("Auth handler ha not been registered yet so we cannot get LLCookie");
        }

        return null;
    }

    private String getOtagUrl() {
        try {
            return settingsClient.getSettingAsString("otag.url");
        } catch (Exception e) {
            LOG.warn("Failed to resolve OtagUrlUpdateHandler", e);
        }

        return null;
    }

    @Override
    public AuthRequestHandler getAuthHandler() {
        return getComponent(com.opentext.otsync.connector.auth.OTSyncAuthHandler.class);
    }

    @Override
    public void onUpdateConnector(EIMConnector eimConnector) {
        LOG.info("EIM Connector Update Received, publishing updated key to CS");
        try {
            // kick of the key registration thread again as someone updated the connector in the Gateway
            TrustedServerKeyRegistrationHandler providerKeyHandler = getComponent(TrustedServerKeyRegistrationHandler.class);
            if (providerKeyHandler != null) {
                providerKeyHandler.updateProviderKey(eimConnector.getProviderKey());
            } else {
                LOG.warn("Could not respond to EIM connector update as we could not resolve the " +
                        "TrustedServerKeyRegistrationHandler component");
            }
        } catch (Exception e) {
            LOG.error("We failed to update the EIMConnector - OTSyncConnector", e);
        }
    }

    @Override
    public Set<String> getSettingKeys() {
        return Sets.newHashSet(Arrays.asList(
                OTSyncConnectorConstants.CS_URL,
                OTSyncConnectorConstants.CS_ADMIN_USER,
                OTSyncConnectorConstants.CS_ADMIN_PWORD));
    }

    private void registerSettingHandlers() {
        addHandler(OTSyncConnectorConstants.CS_URL, (s) -> {
            String newValue = s.getNewValue();
            LOG.info("Updating cs URL -> " + newValue);
            csUrl = newValue;
        });
        addHandler(OTSyncConnectorConstants.CS_ADMIN_USER, (s) -> {
            LOG.info("Updating cs admin user");
            csAdminUser = s.getNewValue();
        });
        addHandler(OTSyncConnectorConstants.CS_ADMIN_PWORD, (s) -> {
            LOG.info("Updating cs admin user");
            csAdminPassword = s.getNewValue();
        });
    }

    /**
     * Read the settings on startup, just in case we are restarting or upgrading.
     */
    private void resolveSettings() {
        resolveSetting(OTSyncConnectorConstants.CS_URL, (s) -> csUrl = s);
        resolveSetting(OTSyncConnectorConstants.CS_ADMIN_USER, (s) -> csAdminUser = s);
        resolveSetting(OTSyncConnectorConstants.CS_ADMIN_PWORD, (s) -> csAdminPassword = s);

        // remove the previously used 'cs auth only' setting from the db
        try {
            String csAuthOnly = "otsync-connector.csAuthOnly";
            if (settingsClient.getSetting(csAuthOnly) != null) {
                settingsClient.removeSetting(csAuthOnly);
                if (LOG.isDebugEnabled())
                    LOG.debug("Removed 'cs auth only' setting from Gateway: " + csAuthOnly);
            }
        } catch (Exception e) {
            LOG.warn("Failed to remove 'cs auth only' setting from Gateway");
        }
    }

    private void resolveSetting(String settingKey, Consumer<String> setter) {
        try {
            Setting setting = settingsClient.getSetting(settingKey);
            if (setting != null) {
                String value = setting.getValue();
                if (value != null) {
                    LOG.info("Discovered " + settingKey + " setting was defined, " +
                            "setting local value " + value);
                    setter.accept(value);
                }
            }
        } catch (APIException e) {
            LOG.error("Failed ro resolve setting " + settingKey + " - " + e.getCallInfo());
        }
    }

    private boolean isAuthRegistered() {
        AuthRegistrationHandler authRegistrationHandler = null;
        try {
            authRegistrationHandler = getComponent(AuthRegistrationHandler.class);
        } catch (Exception e) {
            LOG.warn("AuthRegistrationHandler not found in AW Component Context, auth is not registered");
        }
        return authRegistrationHandler != null && authRegistrationHandler.isAuthRegistered();
    }

}
