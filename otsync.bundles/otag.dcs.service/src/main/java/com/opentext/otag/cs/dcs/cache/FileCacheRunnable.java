package com.opentext.otag.cs.dcs.cache;

import java.nio.file.Path;

public interface FileCacheRunnable {
    void run(Path path) throws Exception;
}
