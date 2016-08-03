package com.opentext.otsync.dcs.cs.node;

import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.dcs.api.DCSApi;
import com.opentext.otsync.dcs.cache.DocumentConversionFileCache;
import com.opentext.otsync.dcs.conversion.DocConversionEngineWrapper;
import com.opentext.otsync.dcs.conversion.DocConversionResult;
import com.opentext.otsync.dcs.cs.CSNodeResource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
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
            csNodeResource.setPagesCount(result.getTotalPages(), version);
            try {
                uploadPages(csNodeResource, result.getPageFilesMap());
            } catch (Exception e) {
                LOG.warn("Upload page" + 1 + " for " + csNodeResource.getNodeID() + " failed", e);
            }
        });
    }

    public void generatePage(final CSNodeResource csNodeResource, int page) throws Exception {
        int version = csNodeResource.getLatestVersion();
        convertNode(csNodeResource, version, page, page + 5,
                result -> uploadPages(csNodeResource, result.getPageFilesMap()));
    }

    private void convertNode(final CSNodeResource csNodeResource, final int version, final int fromPage,
                             final int toPage, final ResultCollector resultCollector) throws Exception {
        final DocConversionResult result = new DocConversionResult();

        // create a new folder for the node id in our file cache
        DocumentConversionFileCache cacheService = getFileCacheService();

        // create a folder for this cs node resource to write our content into
        Path nodeFolder = cacheService.createFolder(csNodeResource.getNodeID());

        // we wrap the conversion in a locking mechanism making sure no one writes to
        // the node folder involved in the conversion
        cacheService.runCacheActionSecurely(nodeFolder, outputPath -> {
            try {
                File nodeFile = getDocumentFileTo(csNodeResource, version, outputPath);
                docConversionEngineWrapper.convert(nodeFile, fromPage, toPage, outputPath, result);
                resultCollector.collect(result);
            } catch (Exception e) {
                LOG.warn("Failed to convert node contents into images", e);
            }
        });
    }

    private DocumentConversionFileCache getFileCacheService() {
        try {
            return AWComponentContext.getComponent(DocumentConversionFileCache.class);
        } catch (Exception e) {
            LOG.error("Failed to resolve DocumentConversionFileCache component???", e);
            throw new WebApplicationException(DCSApi.UNAVAILABLE_ERROR, Response.Status.SERVICE_UNAVAILABLE);
        }
    }

    private void uploadPages(CSNodeResource csNodeResource, Map<Integer, String> pageFilesMap) throws Exception {
        for (Integer pageNumber : pageFilesMap.keySet()) {
            csNodeResource.uploadPage(pageNumber, pageFilesMap.get(pageNumber));
        }
    }

    private File getDocumentFileTo(CSNodeResource csNodeResource, int version, Path location) throws IOException {
        File file = new File(location.toString(), csNodeResource.getNodeID() + "-" + version + ".bin");
        if (!file.exists()) {
            csNodeResource.downloadTo(file);
        }

        return file;
    }

    private interface ResultCollector {
        void collect(DocConversionResult result) throws Exception;
    }

}
