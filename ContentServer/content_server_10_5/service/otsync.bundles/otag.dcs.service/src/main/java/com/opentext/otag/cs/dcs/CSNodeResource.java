package com.opentext.otag.cs.dcs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otag.api.CSRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

public class CSNodeResource {
  public final String nodeID;
  public static final Log log = LogFactory.getLog(CSNodeResource.class);

  private CSRequestBuilderFactory csRequestBuilderFactory;
  private CSDocumentDownloader csDocumentDownloader;
  private CSDocumentPageUploader csDocumentPageUploader;

  public CSNodeResource(String nodeID, CSRequestBuilderFactory csRequestBuilderFactory, CSDocumentDownloader csDocumentDownload, CSDocumentPageUploader csDocumentPageUploader) {
    this.nodeID = nodeID;
    this.csRequestBuilderFactory = csRequestBuilderFactory;
    this.csDocumentDownloader = csDocumentDownload;
    this.csDocumentPageUploader = csDocumentPageUploader;
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
      log.warn("Couldn't get pages count from cs.", e);
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
    csDocumentPageUploader.upload( pageNumber, file);
  }

  public int getLatestVersion() {
    CSRequest csRequest = createCsRequestBuilder()   .func("otag.renderversionnumget")
        .para("nodeID", nodeID)
        .build();
    int version = 0;
    try {
      JsonNode json = execute(csRequest);
      version =json.get("versionNum").asInt();
    } catch (Exception e) {
      log.warn("Couldn't get pages count from cs.", e);
    }

    return version;
  }

  public StreamingOutput getPage(int page)  {
    CSRequest csRequest = createCsRequestBuilder().func("otag.renderedpageget")
        .para("nodeID", nodeID)
        .para("page", String.valueOf(page))
        .build();
    StreamPipe streamPipe = new StreamPipe();
    try {
      csRequest.write(streamPipe);
    } catch (Exception e) {
      log.warn("Couldn't get pages count from cs.", e);
      return null;
    }

    return streamPipe;
  }

  private class StreamPipe extends OutputStream implements StreamingOutput{
    private  ByteArrayOutputStream buffer = new ByteArrayOutputStream();
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

  private JsonNode execute(CSRequest csRequest) throws IOException,WebApplicationException {
    ByteArrayOutputStream bObj = new ByteArrayOutputStream();
    csRequest.write(bObj);
    ObjectReader reader = new ObjectMapper().reader(JsonNode.class);

    return reader.readValue(bObj.toByteArray());
  }
}
