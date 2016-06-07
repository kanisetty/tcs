package com.opentext.tempo.external.invites.appworks.settings;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.settings.Setting;
import com.opentext.otag.sdk.types.v3.settings.SettingType;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

/**
 * Creates the AppWorks managed settings for the service if they don't
 * exist already.
 */
public class SettingsBuilder {

    private static final Logger LOG = LoggerFactory.getLogger(SettingsBuilder.class);

    private SettingsClient settingsClient;

    public SettingsBuilder(SettingsClient settingsClient) {
        this.settingsClient = settingsClient;
    }

    public void initServiceSettings() {
        getSettings().stream().forEach(setting -> {
            String settingKey = setting.getKey();
            try {
                if (!doesSettingExist(settingKey)) {
                    LOG.info("Attempting to create setting {}", settingKey);
                    settingsClient.createSetting(setting);
                } else {
                    LOG.info("Setting {} already existed", settingKey);
                }
            } catch (APIException e) {
                throw new RuntimeException("Failed to create setting for key " + settingKey +
                        " - " + e.getCallInfo());
            }
        });
    }

    private boolean doesSettingExist(String key) {
        try {
            return settingsClient.getSetting(key) != null;
        } catch (APIException e) {
            return false;
        }
    }

    private List<Setting> getSettings() {
        return Arrays.asList(dbUsername(), dbPassword(), dbConnectionString(), emailFrom());
    }

    private Setting dbUsername() {
        return buildSetting(InviteHandlerConstants.USER_NAME, "Database User Name", "tempoInviteHandler",
                "The user name for the invite handler database", 1);
    }

    private Setting dbPassword() {
        return new Setting(InviteHandlerConstants.PASSWORD, InviteHandlerConstants.INVITE_HANDLER_APP_NAME,
                SettingType.password, "Database Password", "", "", "The password for the invite handler database",
                false, false, String.valueOf(2));
    }

    private Setting dbConnectionString() {
        return buildSetting(InviteHandlerConstants.JDBC_URL, "Database (JDBC) Connection String", "",
                "The connection string for the database", 3);
    }

    private Setting emailFrom() {
        return buildSetting(InviteHandlerConstants.EMAIL_FROM, "Email From Address", "inviteHandler@opentext.com",
                "The \"from\" address to use when sending invite emails", 4);
    }

    private Setting buildSetting(String key, String displayName, String value,
                                 String description, int seqNo) {
        return new Setting(key, InviteHandlerConstants.INVITE_HANDLER_APP_NAME,
                SettingType.string, displayName, value, "",
                description, false, false, String.valueOf(seqNo));
    }

}
