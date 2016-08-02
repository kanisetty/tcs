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
        return Arrays.asList(dbUsername(), dbPassword(), dbConnectionString(), emailFrom(), otdsPartition(),
                otdsPartitionAdminName(), otdsPartitionAdminPassword());
    }

    private Setting dbUsername() {
        return buildSetting(InviteHandlerConstants.USER_NAME, "Database User Name", "tempoInviteHandler",
                "The user name for the invite handler database", 1);
    }

    private Setting dbPassword() {
        return buildSetting(InviteHandlerConstants.PASSWORD, "Database Password", "",
                "The password for the invite handler database", SettingType.password, 2);
    }

    private Setting dbConnectionString() {
        return buildSetting(InviteHandlerConstants.JDBC_URL, "Database (JDBC) Connection String", "",
                "The connection string for the database", 3);
    }

    private Setting emailFrom() {
        return buildSetting(InviteHandlerConstants.EMAIL_FROM, "Email From Address", "inviteHandler@opentext.com",
                "The \"from\" address to use when sending invite emails", 4);
    }

    private Setting otdsPartition() {
        return buildSetting(InviteHandlerConstants.OTDS_PARTITION, "OTDS External Users Partition", "otag",
                "The OTDS User Partition where invited users will be managed", 5);
    }

    private Setting otdsPartitionAdminName() {
        return buildSetting(InviteHandlerConstants.OTDS_PARTITION_ADMIN_USER,
                "OTDS Partition Administrator", "otadmin@otds.admin",
                "The Partition Administrator for the OTDS User Partition where invited users will be managed", 6);
    }

    private Setting otdsPartitionAdminPassword() {
        return buildSetting(InviteHandlerConstants.OTDS_PARTITION_ADMIN_PASSWORD,
                "OTDS Partition Administrator Password", "",
                "The Partition Administrator password for the OTDS User Partition where invited users will be managed",
                7);
    }

    private Setting buildSetting(String key, String displayName, String value,
                                 String description, int seqNo) {
        return buildSetting(key, displayName, value, description, SettingType.password, seqNo);
    }

    private Setting buildSetting(String key, String displayName, String value, String description, SettingType type,
                                 int seqNo) {
        return new Setting(key, InviteHandlerConstants.INVITE_HANDLER_APP_NAME,
                type, displayName, value, "", description, false, false, String.valueOf(seqNo));
    }

}
