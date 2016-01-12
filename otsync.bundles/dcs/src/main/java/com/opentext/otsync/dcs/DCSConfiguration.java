package com.opentext.otsync.dcs;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DCSConfiguration {
    public static final Log log = LogFactory.getLog(DCSConfiguration.class);
    public static String docConversionPath = System.getProperty("catalina.base") + "/webapps/dcs/WEB-INF/DocConversionEngine/DocConversionEngine.exe";
    private static String openTextPropertiesFilePath = System.getProperty("catalina.base") + "/conf/opentext.properties";

    public static int maxWidth() {
        return getProperties("dcs_max_img_width", 1200);
    }

    private static int getProperties(String propertyName, int default_value) {
        try {
            Properties properties = new Properties();
            properties.load(new FileInputStream(DCSConfiguration.openTextPropertiesFilePath));
            return Integer.parseInt((String) properties.get(propertyName));
        } catch (IOException e) {
            log.error("Load DCS configuration failed.", e);
        }
        return default_value;
    }

    public static int maxFileSize() {
        return getProperties("dcs_max_file_size", 256) * 1000;
    }
}
