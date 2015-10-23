package com.opentext.otag.cs.connector;

import com.opentext.otag.api.HttpClient;
import com.opentext.otag.cs.connector.auth.trustedprovider.TrustedServerKeyRegistrationHandler;
import com.opentext.otag.sdk.client.ServiceClient;
import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otag.sdk.client.TrustedProviderClient;
import com.opentext.otag.sdk.connector.EIMConnectorService;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceContextHandler;
import com.opentext.otag.sdk.handlers.AppworksServiceStartupComplete;
import com.opentext.otag.sdk.handlers.AuthRequestHandler;
import com.opentext.otag.sdk.provided.OtagUrlUpdateHandler;
import com.opentext.otag.api.shared.types.TrustedProvider;
import com.opentext.otag.api.shared.types.auth.AuthHandlerResult;
import com.opentext.otag.api.shared.types.management.DeploymentResult;
import com.opentext.otag.api.shared.types.proxy.ProxyMappingRepresentation;
import com.opentext.otag.api.shared.types.proxy.ProxySettings;
import com.opentext.otag.api.shared.types.sdk.EIMConnector;
import com.opentext.otag.api.shared.types.settings.Setting;
import com.opentext.otag.api.shared.util.Cookie;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import com.opentext.otag.cs.connector.auth.ContentServerAuthHandler;
import com.opentext.otag.cs.connector.auth.registration.AuthRegistrationHandler;
import jersey.repackaged.com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;
import java.util.function.Consumer;

import static com.opentext.otag.api.shared.types.sdk.AppworksComponentContext.getComponent;

/**
 * Content Server 10.5 EIM Connector.
 * <p>
 * This connector provides information on how to connect to a Content Server
 * instance, and also registers the Content Server authentication handler.
 * <p>
 * It also attempts to register a Trusted Provider key with the
 * Gateway. Retrieving/generating a key via the Gateway is simple but in order
 * to get the key into Content Server we need a valid LLCookie. This means we
 * have to have some valid credentials to use with our Content Server auth handler.
 * We therefore include some configuration settings to allow the user to enter
 * these details.
 */
public class ContentServerConnector extends AbstractMultiSettingChangeHandler
        implements EIMConnectorService, AppworksServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ContentServerConnector.class);

    public static final String CS_COOKIE_NAME = "LLCookie";
    private static final String HTTP_REFERER_HEADER = "REFERER";
    private static final String HTTP_OTCSTICKET_HEADER = "OTCSTICKET";

    private HttpClient httpClient;

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
    public ContentServerConnector() {
        httpClient = new HttpClient();
    }

    @AppworksServiceStartupComplete
    @Override
    public void onStart(String appName) {
        LOG.info("Starting ContentServerConnector EIM connector");

        settingsClient = new SettingsClient();

        ServiceClient serviceClient = new ServiceClient();
        TrustedProviderClient trustedProviderClient = new TrustedProviderClient();

        try {
            TrustedProvider connectorProvider = trustedProviderClient.getOrCreate(getTrustedServerName());
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
                    getConnectionString(), getConnectionStringSettingKey(), getTrustedServerKey(), getProxySettings());

            if (serviceClient.registerConnector(eimConnector)) {
                // tell the Gateway we have finished deploying
                serviceClient.completeDeployment(new DeploymentResult(true));
            } else {
                String errMsg = "Failed to register Content Server EIM Connector with the Gateway";
                LOG.error(errMsg);
                serviceClient.completeDeployment(new DeploymentResult(errMsg));
            }
        } catch (Exception e) {
            String errMsg = "Failed to start the Content Server EIM " +
                    "Connector with the Gateway, " + e.getMessage();
            LOG.error(errMsg, e);
            serviceClient.completeDeployment(new DeploymentResult(errMsg));
        }

    }

    @Override
    public void onStop(String appName) {
        LOG.info("Stopped ContentServerConnector EIM connector");
    }

    @Override
    public String getConnectorName() {
        return "ContentServer";
    }

    @Override
    public String getConnectorVersion() {
        return "10.5";
    }

    @Override
    public String getConnectionString() {
        return csUrl;
    }

    @Override
    public String getConnectionStringSettingKey() {
        return CsConnectorConstants.CS_URL;
    }

    @Override
    public String getTrustedServerName() {
        return "ContentServer";
    }

    @Override
    public String getTrustedServerKey() {
        return trustedServerKey;
    }

    @Override
    public boolean registerTrustedServerKey(String serverName, String key) {
        String connectionString = getConnectionString();

        String otcsticket = getOTCSTicket(csAdminUser, csAdminPassword);

        if (otcsticket == null) {
            LOG.warn("Unable to resolve CS token, we wont be able to register the Trusted Provider key");
            return false;
        }

        try {
            if (connectionString != null) {
                List<NameValuePair> params;

                params = new ArrayList<>();
                params.add(new BasicNameValuePair("func", "otsync.settings"));
                params.add(new BasicNameValuePair("sharedKey", key));
                
                // Also use the configured otag url for this server to set up communications
                // from the otsync notifier, and redirects for Tempo Box
                String otagUrl = getOtagUrl();
                params.add(new BasicNameValuePair("engine", otagUrl + '/'));
                params.add(new BasicNameValuePair("destination_uri", otagUrl));

                HttpUriRequest req = httpClient.getPostRequest(csUrl, params);
                req.addHeader(HTTP_REFERER_HEADER, csUrl);
                req.addHeader(HTTP_OTCSTICKET_HEADER, otcsticket);
                // ForwardHeaders instance was passed here
                // headers.addTo(req);
                HttpClient.DetailedResponse response = httpClient.executeRequestWithDetails(req, null);

                int statusCode = response.status.getStatusCode();
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

    private String getOTCSTicket(String csAdminUser, String csAdminPassword) {

        if (isAuthRegistered()) {
            if (csAdminUser != null && !csAdminUser.isEmpty() &&
                    csAdminPassword != null && !csAdminPassword.isEmpty()) {
                ContentServerAuthHandler authHandler = (ContentServerAuthHandler) getAuthHandler();
                AuthHandlerResult result = authHandler.auth(csAdminUser, csAdminPassword, new ForwardHeaders());
                Map<String, String> additionalParams = result.getAdditionalResponseFields();
                if (additionalParams != null) {
                    String otcsticket = additionalParams.get("otcsticket");
                    return otcsticket;
                }
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
            String otagUrl = "";
            OtagUrlUpdateHandler otagUrlHandler = getComponent(OtagUrlUpdateHandler.class);
            if (otagUrlHandler != null)
                otagUrl = otagUrlHandler.getOtagUrl();

            if (otagUrl == null || otagUrl.isEmpty())
                otagUrl = settingsClient.getSettingAsString("otag.url");

            return otagUrl;
        } catch (Exception e) {
            LOG.warn("Failed to resolve OtagUrlUpdateHandler", e);
        }

        return null;
    }

    @Override
    public AuthRequestHandler getAuthHandler() {
        return getComponent(ContentServerAuthHandler.class);
    }

    @Override
    public ProxySettings getProxySettings() {
        Set<ProxyMappingRepresentation> mappings = Sets.newHashSet(Arrays.asList(
                new ProxyMappingRepresentation("otcs", "localhost/otcs", null),
                new ProxyMappingRepresentation("otcs_support", "localhost/otcs_support", null)));

        Set<String> whiteList = Sets.newHashSet(Arrays.asList(
                "otcs_support/.*",
                "otcs/cs.exe?func=form.*",
                "otcs/cs.exe/displayform.*",
                "otcs/cs.exe?func=formwf.*",
                "otcs/cs.exe?func=work.*",
                "otcs/cs.exe?func=ll&objAction=EditForm.*",
                "otcs/cs.exe?func=webform.*",
                "otcs/cs.exe?func=ll.login",
                "otcs/cs.exe?func=LL.getlogin",
                "otcs/cs.exe?func=ll.DoLogout",
                "otcs/cs.exe?func=ll&objAction=initiate&nexturl=.*workflowview.*",
                "otcs/cs.exe?func=ll&objAction=create*&nextURL=.*workflowview.*",
                "otcs/cs.exe?func=ll&objAction=EditAttrValuesEdit&formname=.*",
                "otcs/cs.exe?func=ll&objAction=targetBrowse&formname=.*",
                "otcs/cs.exe?func=ll&objAction=targetBrowse&formName=.*"
        ));

        return new ProxySettings(mappings, whiteList);
    }

    @Override
    public void onUpdateConnector(EIMConnector eimConnector) {
        LOG.info("EIM Connector Update Received, publishing updated key to CS");
        // kick of the key registration thread again as someone updated the connector in the Gateway
        TrustedServerKeyRegistrationHandler providerKeyHandler = getComponent(TrustedServerKeyRegistrationHandler.class);
        if (providerKeyHandler != null) {
            providerKeyHandler.updateProviderKey(eimConnector.getProviderKey());
        } else {
            LOG.warn("Could not respond to EIM connector update as we could not resolve the " +
                    "TrustedServerKeyRegistrationHandler component");
        }
    }

    @Override
    public Set<String> getSettingKeys() {
        return Sets.newHashSet(Arrays.asList(
                CsConnectorConstants.CS_URL,
                CsConnectorConstants.CS_ADMIN_USER,
                CsConnectorConstants.CS_ADMIN_PWORD));
    }

    private void registerSettingHandlers() {
        addHandler(CsConnectorConstants.CS_URL, (s) -> {
            String newValue = s.getNewValue();
            LOG.info("Updating cs URL -> " + newValue);
            csUrl = newValue;
        });
        addHandler(CsConnectorConstants.CS_ADMIN_USER, (s) -> {
            LOG.info("Updating cs admin user");
            csAdminUser = s.getNewValue();
        });
        addHandler(CsConnectorConstants.CS_ADMIN_PWORD, (s) -> {
            LOG.info("Updating cs admin user");
            csAdminPassword = s.getNewValue();
        });
    }

    /**
     * Read the settings on startup, just in case we are restarting or upgrading.
     */
    private void resolveSettings() {
        resolveSetting(CsConnectorConstants.CS_URL, (s) -> csUrl = s);
        resolveSetting(CsConnectorConstants.CS_ADMIN_USER, (s) -> csAdminUser = s);
        resolveSetting(CsConnectorConstants.CS_ADMIN_PWORD, (s) -> csAdminPassword = s);
    }

    private void resolveSetting(String settingKey, Consumer<String> setter) {
        Setting setting = settingsClient.getSetting(settingKey);
        if (setting != null) {
            String value = setting.getValue();
            if (value != null) {
                LOG.info("Discovered " + settingKey + " setting was defined, " +
                        "setting local value " + value);
                setter.accept(value);
            }
        }
    }

    private boolean isAuthRegistered() {
        AuthRegistrationHandler authRegistrationHandler =
                getComponent(AuthRegistrationHandler.class);
        return authRegistrationHandler != null && authRegistrationHandler.isAuthRegistered();
    }

}
