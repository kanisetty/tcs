package com.opentext.otag.cs.dcs;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;
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
    private String csToken;
    private ForwardHeaders headers;
    private String csurl;

    public CSDocumentDownloader(String nodeID, String csToken, ForwardHeaders forwardHeaders) {
        this.nodeID = nodeID;
        this.csToken = csToken;
        this.headers = forwardHeaders;
        csurl = DocumentConversionService.getService().getCsConnection();
    }

    public void download(File file) throws IOException {
        List<NameValuePair> params = new ArrayList<>(4);
        params.add(new BasicNameValuePair(CSRequest.FUNC_PARAM_NAME, "otsyncll"));
        params.add(new BasicNameValuePair("objId", nodeID));
        params.add(new BasicNameValuePair("objAction", "download"));
        params.add(new BasicNameValuePair("viewType", "1"));


        HttpClient client = new HttpClient();
        HttpUriRequest req = client.getPostRequest(csurl, params);
        try {
            headers.addTo(req);
            HttpContext context = client.getContextWithCookie("llcookie", csToken, csurl);
            HttpResponse response = client.executeRaw(req, context);

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
            req.abort();
            throw e;
        }
    }
}
