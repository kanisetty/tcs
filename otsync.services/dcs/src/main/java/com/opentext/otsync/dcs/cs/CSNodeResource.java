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
import java.net.SocketTimeoutException;

/**
 * Instances of this class are responsible for managing the interaction between
 * this service and a particular Content Server node. It provides download
 * and upload functionality as well as means to make the required HTTP calls
 * to Content Server.
 */
public class CSNodeResource {

    public static final Log LOG = LogFactory.getLog(CSNodeResource.class);

    /**
     * The unique identifier of the node this resource is concerned with, this is the
     * Content Server identifier for said document.
     */
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

    /**
     * Ask the Content Server module if it know how many pages a specific node
     * has. This would have been recorded if the node has been processed previously.
     *
     * @return number of pages
     */
    public int getPagesCount() {
        if (LOG.isTraceEnabled())
            LOG.trace("otag.numpagesget: Retrieving page count from CS for node " + nodeID);
        CSRequest csRequest = createCsRequestBuilder().func("otag.numpagesget")
                .para("nodeID", nodeID)
                .build();
        int count = 0;
        try {
            JsonNode json = execute(csRequest);
            count = json.get("numPages").asInt();
            if (LOG.isTraceEnabled())
                LOG.trace("otag.numpagesget: CS told us that node " + nodeID + " has " + count + " pages");
        } catch (SocketTimeoutException e) {
            LOG.error("otag.numpagesget: Request to get page count for node " + nodeID + " timed out", e);
        } catch (IOException e) {
            LOG.error("otag.numpagesget: Couldn't get pages count from cs.", e);
        }

        return count;
    }

    private CSRequestBuilder createCsRequestBuilder() {
        return csRequestBuilderFactory.newBuilder();
    }

    public void setPagesCount(int count, int version) throws IOException {
        String countString = String.valueOf(count);
        String newVersionNum = Integer.toString(version);

        if (LOG.isTraceEnabled())
            LOG.trace("otag.numpagesset: Setting page count for node " + nodeID + " to " +
                    countString + " new version of doc is " + newVersionNum);

        CSRequest csRequest = createCsRequestBuilder().func("otag.numpagesset")
                .para("nodeID", nodeID)
                .para("versionNum", newVersionNum)
                .para("numPages", countString)
                .build();
        try {
            execute(csRequest);
            if (LOG.isTraceEnabled())
                LOG.trace("otag.numpageset: CS has set page count for node " +
                        nodeID + " successfully");
        } catch (SocketTimeoutException e) {
            LOG.error("otag.numpageset: Request to set the number of pages for node " +
                    nodeID + " has timed out", e);
            throw e;
        }
    }

    public void downloadTo(File file) throws IOException {
        csDocumentDownloader.download(file);
    }

    public void uploadPage(int pageNumber, String file) throws Exception {
        csDocumentPageUploader.upload(pageNumber, file);
    }

    public int getLatestVersion() {
        int version = 0;
        if (LOG.isTraceEnabled())
            LOG.trace("otag.renderversionnumget: Asking CS for the latest version of node " + nodeID);

        CSRequest csRequest = createCsRequestBuilder().func("otag.renderversionnumget")
                .para("nodeID", nodeID)
                .build();
        try {
            JsonNode json = execute(csRequest);
            version = json.get("versionNum").asInt();
            if (LOG.isTraceEnabled())
                LOG.trace("otag.renderversionnumget: CS told us that the latest " +
                        "version of node " + nodeID + " is " + version);
        } catch (SocketTimeoutException e) {
            LOG.error("otag.renderversionnumget: Request to get pages count from cs timed out. " +
                    "Node id - " + nodeID, e);
        } catch (Exception e) {
            LOG.error("otag.renderversionnumget: Couldn't get pages count from cs. " +
                    "Node id - " + nodeID, e);
        }


        return version;
    }

    public StreamingOutput getPage(int page) {
        if (LOG.isTraceEnabled())
            LOG.trace("otag.renderedpageget: Asking CS to get page " + page + " of node " + nodeID);

        CSRequest csRequest = createCsRequestBuilder().func("otag.renderedpageget")
                .para("nodeID", nodeID)
                .para("page", String.valueOf(page))
                .build();

        StreamPipe streamPipe = new StreamPipe();
        try {
            csRequest.write(streamPipe);
            if (LOG.isTraceEnabled())
                LOG.trace("otag.renderedpageget: Retrieved bytes for page " +
                        page + " of node " + nodeID);
        } catch (SocketTimeoutException e) {
            LOG.error("otag.renderedpageget: The request to get the page count from Content Server timed out", e);
            return null;
        } catch (Exception e) {
            LOG.error("otag.renderedpageget: Couldn't get pages count from cs. Node " + nodeID, e);
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
