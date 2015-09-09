package com.opentext.otag.cs.dcs.cache;


import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.cs.dcs.DocumentConversionService;
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
    private Path path;

    public DocumentConversionFileCache(Path path) {
        this.path = path;
    }

    public synchronized static DocumentConversionFileCache createFolder(String name) throws IOException {
        String tmpPath = getDcsCachePath();

        Path path = Paths.get(tmpPath, name);
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

    public synchronized static void cleanup() {
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

    private static String getDcsCachePath() {
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
        return DocumentConversionService.getService().getSettingsClient();
    }

}
