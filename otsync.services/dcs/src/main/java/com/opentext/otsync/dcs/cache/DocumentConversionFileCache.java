package com.opentext.otsync.dcs.cache;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

/**
 * Manages the Document conversion services file cache partition.
 */
public class DocumentConversionFileCache {

    public static final Log log = LogFactory.getLog(DocumentConversionFileCache.class);

    public static final String TMP_PATH_KEY = "otag.tmp.path";
    public static final String TMP_CLEANUP_TIMEOUT_KEY = "otag.tmp.cleanup.timeout";
    public static final String DCS_PARTITION = File.separator + "dcs";

    private static final Set<Path> lockedPaths = new HashSet<>();
    private static SettingsClient settingClient;
    private Path path;

    public DocumentConversionFileCache(Path path) {
        this.path = path;
    }

    public synchronized static DocumentConversionFileCache createFolder(String name) throws IOException {
        String tmpPath = null;
        try {
            tmpPath = getDcsCachePath();
        } catch (APIException e) {
            String errMsg = "Failed to resolve DCS cache path using Gateway";
            log.error(errMsg + " - " + e.getCallInfo());
            throw new RuntimeException(errMsg, e);
        }

        Path tempPath = Paths.get(tmpPath);
        Path path = Paths.get(tmpPath, name);

        if (!Files.exists(tempPath)) {
            Files.createDirectory(tempPath);
        }

        if (!Files.exists(path)) {
            Files.createDirectory(path);
        }

        return new DocumentConversionFileCache(path);
    }

    public void secure(FileCacheRunnable runnable) throws Exception {
        DocumentConversionFileCache.lock(path);

        runnable.run(path);

        DocumentConversionFileCache.unlock(path);
    }

    public synchronized static void cleanup() throws APIException {
        Long tmpCleanupTimeout = getSettingsClient().getSettingAsLong(TMP_CLEANUP_TIMEOUT_KEY);
        long cutoff = System.currentTimeMillis() - tmpCleanupTimeout * 1000;

        String tmpPath = getDcsCachePath();
        File[] files = new File(tmpPath).listFiles();

        for (File file : files) {
            if (!isLocked(file) && FileUtils.isFileOlder(file, cutoff)) {
                try {
                    if (file.isDirectory()) {
                        FileUtils.deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                } catch (IOException e) {
                    log.error("Delete file " + file.toPath() + " failed", e);
                }
            }
        }
    }

    private static String getDcsCachePath() throws APIException {
        return getSettingsClient().getSettingAsString(TMP_PATH_KEY) + DCS_PARTITION;
    }

    private static boolean isLocked(File file) {
        synchronized (lockedPaths) {
            return lockedPaths.contains(file.toPath());
        }
    }


    private static void unlock(Path path) {
        synchronized (lockedPaths) {
            lockedPaths.remove(path);
        }
    }

    private static void lock(Path path) {
        synchronized (lockedPaths) {
            lockedPaths.add(path);
        }
    }

    private static SettingsClient getSettingsClient() {
        if (settingClient == null)
            settingClient = new SettingsClient();

        return settingClient;
    }

}
