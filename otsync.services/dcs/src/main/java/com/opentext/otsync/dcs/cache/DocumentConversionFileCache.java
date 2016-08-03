package com.opentext.otsync.dcs.cache;

import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otsync.dcs.appworks.SettingsService;
import com.opentext.otsync.dcs.utils.FilePathUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;

/**
 * Manages the Document conversion services file cache partition.
 */
public class DocumentConversionFileCache implements AWComponent, ServletContextListener {

    private static final Log LOG = LogFactory.getLog(DocumentConversionFileCache.class);

    /**
     * DCS paths being currently worked on.
     */
    private final Set<Path> lockedPaths = ConcurrentHashMap.newKeySet();

    private final SettingsService settingsService;

    /**
     * Thread that periodically deletes cached content.
     */
    private final FileCacheCleanupThread fileCacheCleanupThread;

    public DocumentConversionFileCache(SettingsService settingsService) {
        this.settingsService = settingsService;
        this.fileCacheCleanupThread = new FileCacheCleanupThread();
        this.fileCacheCleanupThread.start();
    }

    /**
     * Create a new folder within our cache.
     *
     * @param name directory name
     * @return path representing the created cache folder
     * @throws IOException if we cannot create the folder on the host
     */
    public synchronized Path createFolder(String name) throws IOException {
        String tmpPath;
        try {
            tmpPath = getCacheRootPath();
        } catch (APIException e) {
            String errMsg = "Failed to resolve DCS cache path using Gateway";
            LOG.error(errMsg + " - " + e.getCallInfo());
            throw new RuntimeException(errMsg, e);
        }

        Path tempPath = Paths.get(tmpPath);
        if (!Files.exists(tempPath)) {
            Files.createDirectory(tempPath);
        }

        Path path = Paths.get(tmpPath, name);
        if (!Files.exists(path)) {
            Files.createDirectory(path);
        }

        return path;
    }

    /**
     * Run the supplied runable, locking the
     *
     * @param toSecure    path we will we working in during the action
     * @param cacheAction cache action
     * @throws Exception if the cache action function fails
     */
    public void runCacheActionSecurely(Path toSecure, Consumer<Path> cacheAction) throws Exception {
        lock(toSecure);
        cacheAction.accept(toSecure);
        unlock(toSecure);
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // stop the thread once the container signals that the context will shut down
        if (this.fileCacheCleanupThread != null) {
            LOG.info("Stopping file cache cleanup thread");
            this.fileCacheCleanupThread.finish();
        }
    }

    private boolean isLocked(File file) {
        synchronized (lockedPaths) {
            return lockedPaths.contains(file.toPath());
        }
    }

    private void unlock(Path path) {
        synchronized (lockedPaths) {
            lockedPaths.remove(path);
        }
    }

    private void lock(Path path) {
        synchronized (lockedPaths) {
            lockedPaths.add(path);
        }
    }

    /**
     * Get the root directory of our file cache for DCS images. We use the
     * {catalina.base}/tmp/dcs location by default.
     *
     * @return path to physical dcs cache
     */
    private String getCacheRootPath() {
        return FilePathUtils.getContainerPath("tmp", "dcs");
    }

    private synchronized void cleanup() throws APIException {
        Long tmpCleanupTimeout = settingsService.getCleanupTimeout();
        long cutoff = System.currentTimeMillis() - tmpCleanupTimeout * 1000;
        String cacheRootPath = getCacheRootPath();

        File[] files = new File(cacheRootPath).listFiles();
        if (files != null) {
            for (File file : files) {
                if (!isLocked(file) && FileUtils.isFileOlder(file, cutoff)) {
                    try {
                        if (file.isDirectory()) {
                            FileUtils.deleteDirectory(file);
                        } else {
                            boolean wasDeleted = file.delete();
                            if (!wasDeleted)
                                LOG.warn("We failed to delete " + file.getAbsolutePath());
                        }
                    } catch (IOException e) {
                        LOG.error("Delete file " + file.toPath() + " failed", e);
                    }
                }
            }
        }
    }

    private class FileCacheCleanupThread extends Thread {

        // default interval
        static final int AN_HOUR = 3600;

        /**
         * Keep alive flag.
         */
        private volatile boolean keepRunning = true;

        FileCacheCleanupThread() {
            super("DCS-File-Cache-Cleaner-Thread");
        }

        @Override
        public void run() {
            while (keepRunning) {
                try {
                    LOG.info("Running cache cleanup job");
                    cleanup();
                    LOG.info("Cleanup job complete, sleeping ...");
                    sleep();
                } catch (Exception e) {
                    LOG.warn("Error encountered when " + getName() +
                            " attempted to perform the cleanup job, sleeping ...", e);
                    sleep();
                }
            }
        }

        /**
         * Manually ask the Thread to wind down.
         */
        void finish() {
            LOG.info("Shutting down " + getName());
            keepRunning = false;
            this.interrupt();
        }

        /**
         * Ask this Thread to sleep for its allotted time period.
         */
        private void sleep() {
            try {
                // value recorded in seconds
                long cleanupInterval = AN_HOUR;
                try {
                    cleanupInterval = settingsService.getCleanupInterval();
                } catch (APIException e) {
                    // we just use default value if an error occurs getting the
                    // interval setting logging the error
                    LOG.error("SDK API Exception on retrieval of temp cleanup interval setting - " +
                            e.getCallInfo(), e);
                } finally {
                    Thread.sleep(cleanupInterval * 1000);
                }
            } catch (InterruptedException e) {
                // we allow interrupts
                LOG.warn(getName() + " sleep was awoken");
            }
        }
    }

}
