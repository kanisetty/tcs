package com.opentext.otsync.api;

import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;
import java.io.*;
import java.nio.charset.Charset;
import java.util.List;

import static com.opentext.otsync.api.CSRequestHelper.makeRequest;

public class CSMultiPartRequest extends CSRequest implements StreamingOutput {
    public static final Log log = LogFactory.getLog(CSRequest.class);

    private final InputStream fileStream;
    private final String filePartName;
    private final String filename;


    public CSMultiPartRequest(
            String csUrl,
            String func,
            List<NameValuePair> params,
            InputStream fileStream,
            String filePartName,
            String filename,
            CSForwardHeaders headers) {
        super(csUrl, func, params, headers);
        this.fileStream = fileStream;
        this.filePartName = filePartName;
        this.filename = filename;
    }

    @Override
    public void write(OutputStream out) throws IOException, WebApplicationException {

        HttpPost request = null;
        FileInputStream localIn = null;
        File tmpFile = new File(getTmpFilePath());

        try {
            // Since we need the file size (which Jersey doesn't report correctly), we write
            // to a temporary file then stream our upload from there
            saveToFile(fileStream, tmpFile);
            long filesize = tmpFile.length();
            localIn = new FileInputStream(tmpFile);

            ContentBody filePart = new FixedInputStreamBody(localIn, this.filename, filesize);

            MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE, null, Charset.forName("UTF-8"));

            for (NameValuePair param : params) {
                entity.addPart(param.getName(), new StringBody(param.getValue()));
            }

            entity.addPart(this.filePartName, filePart);

            request = new HttpPost(this.csUrl);
            request.setEntity(entity);

            headers.addTo(request);
            CloseableHttpClient httpClient = HttpClientService.getService().getHttpClient();

            try (CloseableHttpResponse response = makeRequest(httpClient, request, headers)) {
                final StatusLine status = response.getStatusLine();
                processResponse(out, response, status);
            }
        } catch (IOException e) {
            log.error("Error contacting Content Server", e);
            if (request != null)
                request.abort();
            throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);

        } finally {
            if (localIn != null) localIn.close();
            if (tmpFile.exists())
                if (!tmpFile.delete())
                    log.warn("Failed to delete temp file after the response was written");
        }
    }

    private String getTmpFilePath() {
        String tmpFileDirPath = System.getProperty("catalina.base") + "/otagfiletmp/";
        File tmpFileDir = new File(tmpFileDirPath);
        if (!tmpFileDir.exists())
            if (!tmpFileDir.mkdir())
                log.warn("Failed to create temp file dir - " + tmpFileDirPath);

        return tmpFileDirPath + System.currentTimeMillis();
    }

    private void saveToFile(InputStream inputStream, File tmpFile) throws IOException {
        FileOutputStream localOut = null;
        try {
            localOut = new FileOutputStream(tmpFile);
            IOUtils.copy(inputStream, localOut);
        } finally {
            inputStream.close();
            if (localOut != null) localOut.close();
        }
    }

}
