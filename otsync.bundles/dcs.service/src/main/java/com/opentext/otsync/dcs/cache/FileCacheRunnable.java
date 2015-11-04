package com.opentext.otsync.dcs.cache;

import java.nio.file.Path;

public interface FileCacheRunnable {
    void run(Path path) throws Exception;
}
