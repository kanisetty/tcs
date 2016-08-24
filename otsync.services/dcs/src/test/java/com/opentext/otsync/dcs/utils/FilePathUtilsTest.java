package com.opentext.otsync.dcs.utils;

import org.junit.Test;

import java.io.File;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;
import static org.fest.assertions.api.Assertions.assertThat;

public class FilePathUtilsTest {

    @Test
    public void getContainerPath() throws Exception {
        String containerBase = FilePathUtils.CONTAINER_BASE;
        if (isNullOrEmpty(containerBase)) {
            System.setProperty(FilePathUtils.CATALINA_BASE, "");
        }
        String expected = File.separator + "webapps" + File.separator + "dcs" + File.separator +
                "WEB-INF" + File.separator + "DocConversionEngine" + File.separator +
                "DocConversionEngine.exe";

        String joinPath = FilePathUtils.getContainerPath("webapps", "dcs", "WEB-INF",
                "DocConversionEngine", "DocConversionEngine.exe");

        assertThat(joinPath).isEqualTo(expected);
    }

    @Test
    public void joinPathTest() throws Exception {
        String expected = File.separator + "webapps" + File.separator + "dcs" + File.separator +
                "WEB-INF" + File.separator + "DocConversionEngine" + File.separator +
                "DocConversionEngine.exe";

        String joinPath = FilePathUtils.joinPath("webapps", "dcs", "WEB-INF",
                "DocConversionEngine", "DocConversionEngine.exe");

        assertThat(joinPath).isEqualTo(expected);
    }

}