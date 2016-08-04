package com.opentext.otsync.dcs.cs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otsync.api.CSRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Instances of this class are responsible for managing the interaction between
 * this service and a particular Content Server node. It provides download
 * and upload functionality as well as means to make the required HTTP calls
 * to Content Server.
 */
public class CSNodeResource {

    public static final Log LOG = LogFactory.getLog(CSNodeResource.class);

    private final String nodeID;
    private final CSRequestBuilderFactory csRequestBuilderFactory;
    private final CSDocumentDownloader csDocumentDownloader;
    private final CSDocumentPageUploader csDocumentPageUploader;

    public CSNodeResource(String nodeID,
                          CSRequestBuilderFactory csRequestBuilderFactory,
                          CSDocumentDownloader csDocumentDownload,
                          CSDocumentPageUploader csDocumentPageUploader) {
        this.nodeID = nodeID;
        this.csRequestBuilderFactory = csRequestBuilderFactory;
        this.csDocumentDownloader = csDocumentDownload;
        this.csDocumentPageUploader = csDocumentPageUploader;
    }

    public String getNodeID() {
        return nodeID;
    }

    public int getPagesCount() {
        CSRequest csRequest = createCsRequestBuilder().func("otag.numpagesget")
                .para("nodeID", nodeID)
                .build();
        int count = 0;
        try {
            JsonNode json = execute(csRequest);
            count = json.get("numPages").asInt();
        } catch (IOException e) {
            LOG.warn("Couldn't get pages count from cs.", e);
        }

        return count;
    }

    private CSRequestBuilder createCsRequestBuilder() {
        return csRequestBuilderFactory.newBuilder();
    }

    public void setPagesCount(int count, int version) throws IOException {
        CSRequest csRequest = createCsRequestBuilder().func("otag.numpagesset")
                .para("nodeID", nodeID)
                .para("versionNum", Integer.toString(version))
                .para("numPages", String.valueOf(count))
                .build();
        execute(csRequest);
    }

    public void downloadTo(File file) throws IOException {
        csDocumentDownloader.download(file);
    }

    public void uploadPage(int pageNumber, String file) throws Exception {
        csDocumentPageUploader.upload(pageNumber, file);
    }

    public int getLatestVersion() {
        CSRequest csRequest = createCsRequestBuilder().func("otag.renderversionnumget")
                .para("nodeID", nodeID)
                .build();
        int version = 0;
        try {
            JsonNode json = execute(csRequest);
            version = json.get("versionNum").asInt();
        } catch (Exception e) {
            LOG.warn("Couldn't get pages count from cs.", e);
        }

        return version;
    }

    public StreamingOutput getPage(int page) {
        CSRequest csRequest = createCsRequestBuilder().func("otag.renderedpageget")
                .para("nodeID", nodeID)
                .para("page", String.valueOf(page))
                .build();
        StreamPipe streamPipe = new StreamPipe();
        try {
            csRequest.write(streamPipe);
        } catch (Exception e) {
            LOG.warn("Couldn't get pages count from cs.", e);
            return null;
        }

        return streamPipe;
    }

    private class StreamPipe extends OutputStream implements StreamingOutput {
        private ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        @Override
        public void write(int i) throws IOException {
            buffer.write(i);
        }

        @Override
        public void write(OutputStream outputStream) throws IOException, WebApplicationException {
            buffer.writeTo(outputStream);
            buffer.close();
        }
    }

    private JsonNode execute(CSRequest csRequest) throws IOException, WebApplicationException {
        ByteArrayOutputStream bObj = new ByteArrayOutputStream();
        csRequest.write(bObj);
        ObjectReader reader = new ObjectMapper().readerFor(JsonNode.class);

        return reader.readValue(bObj.toByteArray());
    }
}
