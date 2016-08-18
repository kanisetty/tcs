package com.opentext.tempo.external.invites.otds;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import com.opentext.tempo.external.invites.otds.domain.OtdsUser;
import com.opentext.tempo.external.invites.otds.domain.PasswordResetObject;
import com.opentext.tempo.external.invites.web.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.GenericType;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

public class OtdsServiceImpl extends AbstractMultiSettingChangeHandler /* AppWorks setting handling */
        implements AWServiceContextHandler, /* AppWorks startup handler, so we can resolve settings */
        OtdsService {

    private static final Logger LOG = LoggerFactory.getLogger(OtdsServiceImpl.class);

    private static final String OTDS_URL = "otds.url";
    private static final GenericType<OtdsUser> OTDS_USER_TYPE = new GenericType<OtdsUser>() {};

    private String otdsUrl;
    private String partition;
    private String user;
    private String password;

    private RestClient otdsClient;
    private SettingsClient settingsClient;

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
        settingsClient = new SettingsClient();

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
                getOtdsUrl(), this.user, isNullOrEmpty(this.password) ? "NO" : "YES");
        if (isNullOrEmpty(getOtdsUrl()) || isNullOrEmpty(this.user) || isNullOrEmpty(this.password)) {
            throw new WebApplicationException("Cannot construct OTDS client", 503); // guess we're not ready
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
        final String errMsg = "Cannot find otds.url setting - not ready?";

        if (otdsUrl == null) {
            try {
                otdsUrl = settingsClient.getSettingAsString(OTDS_URL);
            } catch (APIException e) {
                LOG.error("SDK Call Failed: Failed to get OTDS URL setting - {}", e.getCallInfo());
                throw new WebApplicationException(errMsg, 503);
            }
        }

        if (otdsUrl == null)
            throw new WebApplicationException(errMsg, 503);

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

    @Override
    public OtdsUser createUser(String firstName, String lastName, String email, String password) {
        OtdsUser user = new OtdsUser(firstName, lastName, email, getPartition(), password);
        return getClient().post("/users/", user, OTDS_USER_TYPE);
    }

    @Override
    public OtdsUser createExternalUser(String firstName, String lastName, String email, String password) {
        OtdsUser user = new OtdsUser(firstName, lastName, email, getPartition(), password, true /* isExternal */);
        return getClient().post("/users/", user, OTDS_USER_TYPE);
    }

    private String getPartition() {
        if (isNullOrEmpty(partition)) {
            throw new WebApplicationException(503);
        }
        return partition;
    }

    @Override
    public OtdsUser updateUser(String firstName, String lastName, String email, String newPassword) {
        String userId = toUserId(email);
        OtdsUser user = getUser(userId);
        if (firstName != null || lastName != null) {
            if (firstName != null) {
                user.setFirstName(firstName);
            }
            if (lastName != null) {
                user.setLastName(lastName);
            }
            getClient().put("/users/" + user.getLocation(), user);
        }
        if (newPassword != null) {
            resetPassword(userId, newPassword);
        }
        return user;
    }

    @Override
    public OtdsUser findUser(String userId) {
        try {
            return getUser(userId);
        } catch (WebApplicationException e) {
            if (e.getResponse().getStatus() == 404) {
                return null;
            }
            throw e;
        }
    }

    @Override
    public OtdsUser getUser(String userId) throws WebApplicationException {
        return getClient().get("/users/" + otdsUrlEncode(userId), OTDS_USER_TYPE);
    }

    @Override
    public OtdsUser findUserByEmail(String email) {
        return findUser(toUserId(email));
    }

    @Override
    public OtdsUser getUserByEmail(String email) {
        return getUser(toUserId(email));
    }

    @Override
    public void updatePassword(String userId, String existingPassword, String newPassword) {
        getClient().put("/users/" + otdsUrlEncode(userId) + "/password/", new PasswordResetObject(newPassword));
    }

    @Override
    public void updatePasswordbyEmail(String email, String existingPassword, String newPassword) {
        updatePassword(toUserId(email), existingPassword, newPassword);
    }

    @Override
    public void resetPassword(String userId, String newPassword) {
        getClient().put("/users/" + otdsUrlEncode(userId) + "/password/", new PasswordResetObject(newPassword));
    }

    @Override
    public void resetPasswordByEmail(String email, String newPassword) {
        resetPassword(toUserId(email), newPassword);
    }

    private String toUserId(String email) {
        return email + "@" + getPartition();
    }

    // otds has a special way of encoding
    private String otdsUrlEncode(String s) {
        try {
            String ret = URLEncoder.encode(s, "UTF-8");
            ret.replaceAll("%5C", "%EF%82%A6");
            ret.replaceAll("%2F", "%EF%82%A7");
            return ret;
        } catch (UnsupportedEncodingException e) {
            // utf-8 always supported
            return s;
        }
    }


}
