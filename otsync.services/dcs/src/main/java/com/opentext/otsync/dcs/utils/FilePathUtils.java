package com.opentext.otsync.dcs.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

public class FilePathUtils {

    private static final Log LOG = LogFactory.getLog(FilePathUtils.class);

    // Tomcat server root constants
    public static final String CATALINA_BASE = "catalina.base";
    public static final String CONTAINER_BASE = System.getProperty(CATALINA_BASE);

    public static String getContainerPath(String... pathElements) {
        List<String> strings = new ArrayList<>(Arrays.asList(pathElements));
        if (!isNullOrEmpty(CONTAINER_BASE)) {
            strings.add(0, CONTAINER_BASE);
        } else {
            LOG.warn("Tomcat home {catalina.base} was not defined");
        }
        return joinPath(strings.toArray(new String[pathElements.length]));
    }

    public static String joinPath(String... pathElements) {
        return File.separator +
                Arrays.stream(pathElements).collect(Collectors.joining(File.separator));
    }

}
