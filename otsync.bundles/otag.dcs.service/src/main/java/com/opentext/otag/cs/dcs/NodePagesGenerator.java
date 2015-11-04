package com.opentext.otag.cs.dcs;

import com.opentext.otag.cs.dcs.cache.DocumentConversionFileCache;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;

public class NodePagesGenerator {
    private DocConversionEngineWrapper docConversionEngineWrapper;
    public static final Log log = LogFactory.getLog(CSNodeResource.class);

    public NodePagesGenerator() {
        this.docConversionEngineWrapper = new DocConversionEngineWrapper();
    }

    public void generatePagesCount(final CSNodeResource csNodeResource) throws Exception {
        final int version = csNodeResource.getLatestVersion();
        convertNode(csNodeResource, version, 1, 1, result -> {
            csNodeResource.setPagesCount(result.totalPages, version);
            try {
                uploadPages(csNodeResource, result.pageFilesMap);
            } catch (Exception e) {
                log.warn("Upload page" + 1 + " for " + csNodeResource.nodeID + " failed", e);
            }
        });
    }

    public void generatePage(final CSNodeResource csNodeResource, int page) throws Exception {
        int version = csNodeResource.getLatestVersion();
        convertNode(csNodeResource, version, page, page + 5,
                result -> uploadPages(csNodeResource, result.pageFilesMap));
    }

    private void convertNode(final CSNodeResource csNodeResource, final int version, final int fromPage,
                             final int toPage, final ResultCollector resultCollector) throws Exception {
        final DocConversionResult result = new DocConversionResult();
        DocumentConversionFileCache.createFolder(csNodeResource.nodeID).secure(outputPath -> {
            File nodeFile = getDocumentFileTo(csNodeResource, version, outputPath);

            docConversionEngineWrapper.convert(nodeFile, fromPage, toPage, outputPath, result);

            resultCollector.collect(result);
        });
    }

    private void uploadPages(CSNodeResource csNodeResource, Map<Integer, String> pageFilesMap) throws Exception {
        for (Integer pageNumber : pageFilesMap.keySet()) {
            csNodeResource.uploadPage(pageNumber, pageFilesMap.get(pageNumber));
        }
    }

    private File getDocumentFileTo(CSNodeResource csNodeResource, int version, Path location) throws IOException {
        File file = new File(location.toString(), csNodeResource.nodeID + "-" + version + ".bin");
        if (!file.exists()) {
            csNodeResource.downloadTo(file);
        }

        return file;
    }

    private interface ResultCollector {
        void collect(DocConversionResult result) throws Exception;
    }
}
