package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.appworks.ServiceIndex;
import com.opentext.otsync.dcs.cache.DocumentConversionFileCache;
import com.opentext.otsync.dcs.conversion.DocConversionEngineWrapper;
import com.opentext.otsync.dcs.conversion.DocConversionResult;
import com.opentext.otsync.dcs.cs.CSNodeResource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;

public class NodePagesGenerator {

    private static final Log LOG = LogFactory.getLog(CSNodeResource.class);

    private final DocConversionEngineWrapper docConversionEngineWrapper;

    public NodePagesGenerator() {
        this.docConversionEngineWrapper = new DocConversionEngineWrapper();
    }

    public void generatePagesCount(final CSNodeResource csNodeResource) throws Exception {
        final int version = csNodeResource.getLatestVersion();
        convertNode(csNodeResource, version, 1, 1, result -> {
            String nodeID = csNodeResource.getNodeID();
            if (LOG.isDebugEnabled())
                LOG.debug("Converting node " + nodeID + "version " + version);

            try {
                int totalPages = result.getTotalPages();
                csNodeResource.setPagesCount(totalPages, version);
                if (LOG.isDebugEnabled())
                    LOG.debug("Set page count for  node " + nodeID + "to " + totalPages);

                try {
                    uploadPages(csNodeResource, result.getPageFilesMap());
                } catch (Exception e) {
                    LOG.error("Upload page" + 1 + " for " + nodeID + " failed", e);
                }
            } catch (Exception e) {
                LOG.error("We failed to set the page count for node " + nodeID, e);
            }
        });
    }

    public void generatePage(final CSNodeResource csNodeResource, int page) throws Exception {
        int version = csNodeResource.getLatestVersion();
        convertNode(csNodeResource, version, page, page + 5,
                result -> uploadPages(csNodeResource, result.getPageFilesMap()));
    }

    private void convertNode(final CSNodeResource csNodeResource,
                             final int version,
                             final int fromPage,
                             final int toPage,
                             final ResultCollector resultCollector) throws Exception {
        String nodeID = csNodeResource.getNodeID();
        final String conversionErr = "Failed to convert node %s contents";

        try {
            final DocConversionResult result = new DocConversionResult();

            // create a new folder for the node id in our file cache
            DocumentConversionFileCache cacheService = ServiceIndex.getFileCacheService();

            // create a folder for this cs node resource to write our content into
            Path nodeFolder = cacheService.createFolder(nodeID);

            // we wrap the conversion in a locking mechanism making sure no one writes to
            // the node folder involved in the conversion
            cacheService.runCacheActionSecurely(nodeFolder, outputPath -> {
                try {
                    // read from the local disk or download to that location
                    File nodeFile = getOrDownloadDocFile(csNodeResource, version, outputPath);
                    // run conversion
                    docConversionEngineWrapper.convert(nodeFile, fromPage, toPage, outputPath, result);
                    // inject into result object
                    resultCollector.collect(result);
                } catch (Exception e) {
                    // throw if we fail to convert the node
                    throw new RuntimeException(String.format(conversionErr, nodeID), e);
                }
            });
        } catch (Exception e) {
            // if the consumer threw, rethrow, else report the error
            if (e instanceof RuntimeException)
                throw e;
            throw new RuntimeException(String.format(conversionErr, nodeID), e);
        }
    }

    private void uploadPages(CSNodeResource csNodeResource, Map<Integer, String> pageFilesMap) throws Exception {
        for (Integer pageNumber : pageFilesMap.keySet()) {
            if (LOG.isDebugEnabled())
                LOG.debug("Uploading page " + pageNumber + " for node " + csNodeResource.getNodeID());
            csNodeResource.uploadPage(pageNumber, pageFilesMap.get(pageNumber));
        }
    }

    private File getOrDownloadDocFile(CSNodeResource csNodeResource, int version, Path location) throws IOException {
        String binFileName = csNodeResource.getNodeID() + "-" + version + ".bin";
        File file = new File(location.toString(), binFileName);
        if (!file.exists()) {
            if (LOG.isDebugEnabled())
                LOG.debug("downloading .bin file as it wasn't found locally - " + binFileName);
            csNodeResource.downloadTo(file);
        } else {
            if (LOG.isDebugEnabled())
                LOG.debug(binFileName + " already existed, returning local copy");
        }

        return file;
    }

    private interface ResultCollector {
        void collect(DocConversionResult result) throws Exception;
    }

}
