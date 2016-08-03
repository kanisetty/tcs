package com.opentext.otsync.dcs.appworks;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.service.context.components.AWComponent;

public class SettingsService implements AWComponent {

    /**
     * The Gateway admin can use this setting to specify how often any temporary
     * content should live, defaults to 1 hour. Value is recorded in seconds.
     */
    private static final String TMP_CLEANUP_TIMEOUT_KEY = "otag.tmp.cleanup.timeout";

    /**
     * The Gateway admin can use this setting to specify the interval on which we
     * should check for outdated temporary content, defaults to 1 hour. Value is
     * recorded in seconds.
     */
    private static final String TEMPFILE_CLEANUP_INTERVAL = "otag.tmp.cleanup.interval";

    /**
     * AppWorks SDK config settings client.
     */
    private final SettingsClient settingsClient;

    public SettingsService(SettingsClient settingsClient) {
        this.settingsClient = settingsClient;
    }

    public int maxWidth() throws APIException {
        return settingsClient.getSettingAsInt("imageWidth");
    }

    public int maxFileSize() throws APIException {
        return settingsClient.getSettingAsInt("maxFileSize");
    }

    public long getCleanupTimeout() throws APIException {
        return settingsClient.getSettingAsLong(TMP_CLEANUP_TIMEOUT_KEY);
    }

    public long getCleanupInterval() throws APIException {
        return settingsClient.getSettingAsLong(TEMPFILE_CLEANUP_INTERVAL);
    }

}
