package com.opentext.otsync.dcs;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;

public class DCSSettings {

    public static String conversionEnginePath = System.getProperty("catalina.base") + "/webapps/dcs/WEB-INF/DocConversionEngine/DocConversionEngine.exe";

    private static SettingsClient settingsClient = new SettingsClient();

    public static int maxWidth() throws APIException {
        return settingsClient.getSettingAsInt("imageWidth");
    }

    public static int maxFileSize() throws APIException {
        return settingsClient.getSettingAsInt("maxFileSize");
    }
}
