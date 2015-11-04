package com.opentext.otag.cs.dcs;

import com.opentext.otag.cs.dcs.utils.IOUtils;
import com.opentext.otag.cs.dcs.utils.ImageUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;

import java.io.File;
import java.nio.file.Path;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.Semaphore;

public class DocConversionEngineWrapper {
    private String docConversionPath = System.getProperty("catalina.base") + "/webapps/dcs/WEB-INF/DocConversionEngine/DocConversionEngine.exe";
    public static final Log log = LogFactory.getLog(DocConversionEngineWrapper.class);

    private static Semaphore maxProcessSemaphore = new Semaphore(10);

    public void convert(File inputFile, int fromPage, int toPage, Path outputPath, DocConversionResult result) throws Exception {
        Scanner scanner = null;
        try {
            String outputFileName = new File(outputPath.toString(), inputFile.getName() + ".png").getAbsolutePath();
            String doneFile = new File(outputPath.toString(), inputFile.getName() + ".dcs." + fromPage + "-" + toPage + ".done").getAbsolutePath();
            ProcessBuilder pb = new ProcessBuilder(
                    docConversionPath,
                    inputFile.getAbsolutePath(),
                    outputFileName,
                    doneFile,
                    fromPage + "-" + toPage,
                    "1200");

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
        for (Integer pageNumber : pageFilesMap.keySet()) {
            File imageToScale = new File(pageFilesMap.get(pageNumber));
            if (imageToScale.length() > 256 * 1000) {
                try {
                    ImageUtils.scaleDocImageBeforeUpload(imageToScale, 700, true, false);
                } catch (Exception e) {
                    log.error("Scale page " + pageNumber + "failed.", e);
                }
            }
        }
    }
}
