package com.opentext.otsync.dcs;

import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CSDocumentDownloader {

    private String nodeID;
    private CSForwardHeaders headers;
    private String csUrl;

    public CSDocumentDownloader(String nodeID, CSForwardHeaders forwardHeaders) {
        this.nodeID = nodeID;
        this.headers = forwardHeaders;
        csUrl = DocumentConversionService.getCsUrl();
    }

    public void download(File file) throws IOException {
        List<NameValuePair> params = new ArrayList<>(4);
        params.add(new BasicNameValuePair(CSRequest.FUNC_PARAM_NAME, "otsyncll"));
        params.add(new BasicNameValuePair("objId", nodeID));
        params.add(new BasicNameValuePair("objAction", "download"));
        params.add(new BasicNameValuePair("viewType", "1"));

        DefaultHttpClient httpClient = new DefaultHttpClient();
        HttpPost request = new HttpPost(csUrl);
        request.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));

        try {
            headers.addTo(request);
            headers.getLLCookie().addLLCookieToRequest(httpClient, request);

            HttpResponse response = httpClient.execute(request);

            if (response.getHeaders("Warning").length > 0) {
                throw new IOException(response.getHeaders("Warning")[0].toString());
            }

            final StatusLine statusLine = response.getStatusLine();

            if (statusLine.getStatusCode() != HttpStatus.SC_OK) {
                EntityUtils.consume(response.getEntity());
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
            throw e;
        }
    }
}
