package com.opentext.otsync.dcs.cs;

import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.dcs.appworks.ServiceIndex;
import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import static com.opentext.otsync.api.CSRequestHelper.makeRequest;

public class CSDocumentDownloader {

    private static final Log LOG = LogFactory.getLog(CSDocumentDownloader.class);

    private String nodeID;
    private CSForwardHeaders headers;

    public CSDocumentDownloader(String nodeID, CSForwardHeaders forwardHeaders) {
        this.nodeID = nodeID;
        this.headers = forwardHeaders;
    }

    public void download(File file) throws IOException {
        if (LOG.isDebugEnabled())
            LOG.debug("Downloading file " + file.getName());

        List<NameValuePair> params = new ArrayList<>(4);
        params.add(new BasicNameValuePair(CSRequest.FUNC_PARAM_NAME, "otsyncll"));
        params.add(new BasicNameValuePair("objId", nodeID));
        params.add(new BasicNameValuePair("objAction", "download"));
        params.add(new BasicNameValuePair("viewType", "1"));

        CloseableHttpClient httpClient = HttpClientService.getService().getHttpClient();
        HttpPost request = new HttpPost(ServiceIndex.getCSUrlProvider().getContentServerUrl());
        request.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
        headers.addTo(request);

        try (CloseableHttpResponse response = makeRequest(httpClient, request, headers)) {
            if (response.getHeaders("Warning").length > 0)
                throw new IOException(response.getHeaders("Warning")[0].toString());

            StatusLine statusLine = response.getStatusLine();
            if (statusLine.getStatusCode() != HttpStatus.SC_OK) {;
                throw new WebApplicationException(Response.status(new Response.StatusType() {
                    public int getStatusCode() {
                        return statusLine.getStatusCode();
                    }

                    public String getReasonPhrase() {
                        return statusLine.getReasonPhrase();
                    }

                    public Response.Status.Family getFamily() {
                        return Response.Status.Family.CLIENT_ERROR;
                    }
                }).build());
            }

            InputStream downloadStream = response.getEntity().getContent();
            FileUtils.copyInputStreamToFile(downloadStream, file);
            downloadStream.close();
        } catch (IOException e) {
            request.abort();
            LOG.error("Download failed", e);
            throw e;
        }
    }

}
