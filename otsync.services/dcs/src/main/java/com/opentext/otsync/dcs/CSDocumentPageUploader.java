package com.opentext.otsync.dcs;

import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.api.FixedInputStreamBody;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CSDocumentPageUploader {

    private String nodeID;
    private CSForwardHeaders headers;
    private String csUrl;
    private TrustedProviderClient trustedProviderClient;

    public CSDocumentPageUploader(String nodeID, CSForwardHeaders csForwardHeaders) {
        this.nodeID = nodeID;
        this.headers = csForwardHeaders;
        csUrl = DocumentConversionService.getCsUrl();
        trustedProviderClient = new TrustedProviderClient();
    }

    public void upload(Integer pageNumber, String file) throws Exception {
        TrustedProvider provider = trustedProviderClient.getOrCreate("ContentServer");

        if (provider == null)
            throw new IOException("Unable to get ContentServer Provider");

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair(CSRequest.FUNC_PARAM_NAME, "otag.renderedpagepost"));
        params.add(new BasicNameValuePair("nodeID", nodeID));
        params.add(new BasicNameValuePair("page", Integer.toString(pageNumber)));
        params.add(new BasicNameValuePair("key", provider.getKey()));

        Long size = new File(file).length();
        HttpPost request = null;

        try (InputStream in = new FileInputStream(file)) {
            DefaultHttpClient httpClient = new DefaultHttpClient();

            ContentBody filePart = new FixedInputStreamBody(in, "otag-dcs.png", size);

            MultipartEntity entity = new MultipartEntity();

            for (NameValuePair param : params) {
                entity.addPart(param.getName(), new StringBody(param.getValue()));
            }

            entity.addPart("file", filePart);

            request = new HttpPost(csUrl);
            request.setEntity(entity);

            headers.addTo(request);
            headers.getLLCookie().addLLCookieToRequest(httpClient, request);

            HttpResponse response = httpClient.execute(request);

            final StatusLine statusLine = response.getStatusLine();

            if (statusLine.getStatusCode() != HttpStatus.SC_OK) {

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
        } catch (Exception e) {
            if (request != null) request.abort();
            throw e;
        }
    }
}
