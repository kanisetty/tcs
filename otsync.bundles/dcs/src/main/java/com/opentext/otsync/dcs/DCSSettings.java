package com.opentext.otsync.dcs;

import com.opentext.otag.sdk.client.SettingsClient;

public class DCSSettings {
    public static String conversionEnginePath = System.getProperty("catalina.base") + "/webapps/dcs/WEB-INF/DocConversionEngine/DocConversionEngine.exe";
    private static SettingsClient settingsClient = new SettingsClient();

    public static int maxWidth() {
        return settingsClient.getSettingAsInt("imageWidth");
    }

    public static int maxFileSize() {
        return settingsClient.getSettingAsInt("maxFileSize");
    }
}
