package com.opentext.otsync.dcs;

import com.opentext.otsync.dcs.utils.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.Semaphore;
import com.opentext.otsync.dcs.utils.ImageUtils;

public class DocConversionEngineWrapper {
    public static final Log log = LogFactory.getLog(DocConversionEngineWrapper.class);

    private static Semaphore maxProcessSemaphore = new Semaphore(10);

    public void convert(File inputFile, int fromPage, int toPage, Path outputPath, DocConversionResult result) throws Exception {
        Scanner scanner = null;
        try {
            String outputFileName = new File(outputPath.toString(), inputFile.getName() + ".png").getAbsolutePath();
            String doneFile = new File(outputPath.toString(), inputFile.getName() + ".dcs." + fromPage + "-" + toPage + ".done").getAbsolutePath();
            ProcessBuilder pb = new ProcessBuilder(
                    DCSSettings.conversionEnginePath,
                    inputFile.getAbsolutePath(),
                    outputFileName,
                    doneFile,
                    fromPage + "-" + toPage,
                    Integer.toString(DCSSettings.maxWidth()));

            execute(pb);

            scanner = new Scanner(new File(doneFile));
            JSONObject doneInfo = new JSONObject(scanner.useDelimiter("\\Z").next());

            if (doneInfo.getBoolean("success")) {
                result.totalPages = doneInfo.getInt("numpages");
                collectResultFiles(fromPage, toPage, outputFileName, result.pageFilesMap);

                scalePageFiles(result.pageFilesMap);
            } else {
                log.error("Convert file failed" + doneInfo.getString("errormsg"));
                throw new Exception(doneInfo.getString("errormsg"));
            }
        } catch (Exception e) {
            log.error("Convert file failed", e);
            throw (e);
        } finally {
            if (scanner != null) {
                scanner.close();
            }
        }
    }

    private void collectResultFiles(int fromPage, int toPage, String outputFileName, Map<Integer, String> filePageMap) {
        for (int page = fromPage; page <= toPage; page++) {
            String file = IOUtils.appendToFileName(outputFileName, "_" + page);
            if (new File(file).exists()) {
                filePageMap.put(page, file);
            }
        }
    }

    private void execute(ProcessBuilder pb) throws Exception {
        maxProcessSemaphore.acquire();
        try {
            pb.start().waitFor();
        } catch (Exception e) {
            throw (e);
        } finally {
            maxProcessSemaphore.release();
        }
    }

    private void scalePageFiles(Map<Integer, String> pageFilesMap) {
        int maxFileSize = DCSSettings.maxFileSize();
        for (Integer pageNumber : pageFilesMap.keySet()) {
            try {
                File imageToScale = new File(pageFilesMap.get(pageNumber));
                ImageUtils.scaleDocImageToProperSize(imageToScale, maxFileSize);
            } catch (IOException e) {
                log.error("Scale image file failed", e);
            }
        }
    }
}
