package com.opentext.tempo.external.invites.otds;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import com.opentext.tempo.external.invites.api.OtagInviteServlet;
import com.opentext.tempo.external.invites.web.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

public class OtdsServiceImpl extends AbstractMultiSettingChangeHandler /* AppWorks setting handling */
        implements AWServiceContextHandler, /* AppWorks startup handler, so we can resolve settings */
        OtdsService {

    private static final Logger LOG = LoggerFactory.getLogger(OtdsServiceImpl.class);

    private OtdsClient restClient;
    private String otdsUrl;
    private String partition;
    private String user;
    private String password;

    private RestClient otdsClient;

    public OtdsServiceImpl() {
        // handle settings updates
        addHandler(InviteHandlerConstants.OTDS_PARTITION, settingsChangeMessage -> {
            partition = settingsChangeMessage.getNewValue();
            newOtdsClient();
        });
        addHandler(InviteHandlerConstants.OTDS_PARTITION_ADMIN_USER, settingsChangeMessage -> {
            user = settingsChangeMessage.getNewValue();
            newOtdsClient();
        });
        addHandler(InviteHandlerConstants.OTDS_PARTITION_ADMIN_PASSWORD, settingsChangeMessage -> {
            password = settingsChangeMessage.getNewValue();
            newOtdsClient();
        });
    }

    @Override
    public void onStart(String s) {
        LOG.info("OtdsServiceImpl#onStart");
        // attempt to resolve our settings now it is safe to instantiate SDK clients
        SettingsClient settingsClient = new SettingsClient();

        // init otds url
        getOtdsUrl();

        getSettingKeys().forEach(key -> {
            switch (key) {
                case InviteHandlerConstants.OTDS_PARTITION:
                    this.partition = resolveSetting(key, settingsClient);
                    break;
                case InviteHandlerConstants.OTDS_PARTITION_ADMIN_USER:
                    this.user = resolveSetting(key, settingsClient);
                    break;
                case InviteHandlerConstants.OTDS_PARTITION_ADMIN_PASSWORD:
                    this.password = resolveSetting(key, settingsClient);
                    break;
                default:
                    LOG.warn("Unknown setting key {}", key);
            }
        });
    }

    private synchronized RestClient getClient() {
        if (otdsClient == null)
            otdsClient = newOtdsClient();
        return otdsClient;
    }

    private synchronized RestClient newOtdsClient() {
        if (otdsClient != null) {
            otdsClient.close();
        }
        LOG.debug("Attempting to construct OTDS client URL: {} User: {} Password Specified: {}",
                getOtdsUrl(), this.user, isNullOrEmpty(this.password)?"NO":"YES");
        if (isNullOrEmpty(getOtdsUrl()) || isNullOrEmpty(this.user) || isNullOrEmpty(this.password)) {
            // todo proper exception handling - should return HTTP 503 - not ready
            throw new RuntimeException("Cannot construct OTDS client");
        }
        otdsClient = new OtdsClient(getOtdsUrl(), user, password);
        return otdsClient;
    }

    @Override
    public void onStop(String s) {
    }

    @Override
    public Set<String> getSettingKeys() {
        return new HashSet<>(Arrays.asList(
                InviteHandlerConstants.OTDS_PARTITION,
                InviteHandlerConstants.OTDS_PARTITION_ADMIN_USER,
                InviteHandlerConstants.OTDS_PARTITION_ADMIN_PASSWORD
        ));
    }

    private String getOtdsUrl() {
        if (isNullOrEmpty(otdsUrl)) {
            synchronized (this) {
                otdsUrl = OtagInviteServlet.getSettingValue("otds.url");
            }
        }
        return otdsUrl;
    }

    private String resolveSetting(String key, SettingsClient settingsClient) {
        try {
            return settingsClient.getSettingAsString(key);
        } catch (APIException e) {
            LOG.warn("Failed to lookup setting {} - {}", key, e.getCallInfo());
            return "";
        }
    }

}
