package com.opentext.otsync.dcs.conversion;

import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.dcs.appworks.SettingsService;
import com.opentext.otsync.dcs.api.DCSApi;
import com.opentext.otsync.dcs.utils.FilePathUtils;
import com.opentext.otsync.dcs.utils.IOUtils;
import com.opentext.otsync.dcs.utils.ImageUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.Semaphore;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

/**
 * Service that acts as a proxy to the document conversion engine.
 */
public class DocConversionEngineWrapper {

    private static final Log LOG = LogFactory.getLog(DocConversionEngineWrapper.class);

    /**
     * Max number of jobs to throw at the conversion engine at any given time.
     */
    private static Semaphore maxProcessSemaphore = new Semaphore(10);

    /**
     * Config settings service.
     */
    private volatile SettingsService settingsService;

    /**
     * System path to the location of the application used to perform the conversion.
     */
    private String conversionEnginePath;

    /**
     * Convert a given set of pages of a supplied document into a series of images using
     * the conversion engine embedded in the service.
     *
     * @param inputFile  to convert
     * @param fromPage   page range start
     * @param toPage     page range end
     * @param outputPath where should the files be written to
     * @param result     conversion result
     * @throws Exception if the conversion fails
     */
    public void convert(File inputFile, int fromPage, int toPage, Path outputPath,
                        DocConversionResult result) throws Exception {
        try {
            String outputFileName = new File(outputPath.toString(), inputFile.getName() + ".png").getAbsolutePath();
            String donePath = inputFile.getName() + ".dcs." + fromPage + "-" + toPage + ".done";
            String doneFile = new File(outputPath.toString(), donePath).getAbsolutePath();

            // build a job to throw at the conversion engine specifying the desired locations
            ProcessBuilder pb = new ProcessBuilder(
                    getConversionEnginePath(),
                    inputFile.getAbsolutePath(),
                    outputFileName,
                    doneFile,
                    fromPage + "-" + toPage,
                    Integer.toString(getSettingsService().maxWidth()));

            execute(pb);

            try (Scanner scanner = new Scanner(new File(doneFile))) {
                JSONObject doneInfo = new JSONObject(scanner.useDelimiter("\\Z").next());

                if (doneInfo.getBoolean("success")) {
                    result.setTotalPages(doneInfo.getInt("numpages"));
                    collectResultFiles(fromPage, toPage, outputFileName, result);

                    scalePageFiles(result.getPageFilesMap());
                } else {
                    String errorMsg = doneInfo.getString("errormsg");
                    LOG.error("Convert file failed" + errorMsg);
                    throw new Exception(errorMsg);
                }
            } catch (FileNotFoundException e) {
                throw new RuntimeException("Failed to fine .done file for document conversion job", e);
            }
        } catch (Exception e) {
            LOG.error("Convert file failed", e);
            throw e;
        }
    }

    private void collectResultFiles(int fromPage, int toPage,
                                    String outputFileName,
                                    DocConversionResult conversionResult) {
        for (int page = fromPage; page <= toPage; page++) {
            String file = IOUtils.appendToFileName(outputFileName, "_" + page);
            // if a file with the resolved name exists add it to the result
            if (new File(file).exists()) {
                conversionResult.addPageFile(page, file);
            }
        }
    }

    private void execute(ProcessBuilder pb) throws Exception {
        maxProcessSemaphore.acquire();
        try {
            pb.start().waitFor();
        } finally {
            maxProcessSemaphore.release();
        }
    }

    private void scalePageFiles(Map<Integer, String> pageFilesMap) {
        try {
            int maxFileSize = getSettingsService().maxFileSize();
            for (Integer pageNumber : pageFilesMap.keySet()) {
                try {
                    File imageToScale = new File(pageFilesMap.get(pageNumber));
                    ImageUtils.scaleDocImageToProperSize(imageToScale, maxFileSize);
                } catch (IOException e) {
                    LOG.error("Scale image file failed", e);
                }
            }
        } catch (APIException e) {
            LOG.error("Failed to resolve max file size using SDK call - " + e.getCallInfo());
        }
    }

    private String getConversionEnginePath() {
        if (isNullOrEmpty(conversionEnginePath))
            conversionEnginePath = FilePathUtils.getContainerPath(
                    "webapps", "dcs", "WEB-INF", "DocConversionEngine", "DocConversionEngine.exe");

        return conversionEnginePath;
    }

    private SettingsService getSettingsService() {
        try {
            if (settingsService == null)
                settingsService = AWComponentContext.getComponent(SettingsService.class);
            return settingsService;
        } catch (Exception e) {
            LOG.error("Failed to resolve SettingsService component???", e);
            throw new WebApplicationException(DCSApi.UNAVAILABLE_ERROR, Response.Status.SERVICE_UNAVAILABLE);
        }
    }

}
