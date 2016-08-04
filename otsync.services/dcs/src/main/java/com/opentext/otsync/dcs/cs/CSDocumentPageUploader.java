package com.opentext.otsync.dcs.cs;

import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.api.FixedInputStreamBody;
import com.opentext.otsync.dcs.appworks.ContentServerURLProvider;
import com.opentext.otsync.dcs.appworks.ServiceIndex;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CSDocumentPageUploader {

    private static final Log LOG = LogFactory.getLog(CSDocumentPageUploader.class);

    private String nodeID;
    private CSForwardHeaders headers;

    private TrustedProviderClient trustedProviderClient;
    private volatile ContentServerURLProvider urlProvider;

    public CSDocumentPageUploader(String nodeID, CSForwardHeaders csForwardHeaders) {
        this.nodeID = nodeID;
        this.headers = csForwardHeaders;
        trustedProviderClient = new TrustedProviderClient();
    }

    public void upload(Integer pageNumber, String file) throws Exception {
        if (LOG.isDebugEnabled())
            LOG.debug("uploading page " + pageNumber + " of file " + file);

        TrustedProvider provider = null;
        try {
            provider = trustedProviderClient.getOrCreate("ContentServer");
        } catch (APIException e) {
            LOG.error("Failed to create CS trusted provider via SDK - " + e.getCallInfo(), e);
        }

        if (provider == null)
            throw new RuntimeException("Unable to get ContentServer Provider");

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

            request = new HttpPost(getCsUrl());
            request.setEntity(entity);

            headers.addTo(request);
            headers.getLLCookie().addLLCookieToRequest(httpClient, request);

            if (LOG.isDebugEnabled())
                LOG.debug("Posting CS request -func:otag.renderedpagepost");
            HttpResponse response = httpClient.execute(request);

            final StatusLine statusLine = response.getStatusLine();

            int respStatusCode = statusLine.getStatusCode();
            if (respStatusCode != HttpStatus.SC_OK) {
                LOG.error("Upload failed, received status code - " + respStatusCode);
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
            if (LOG.isDebugEnabled())
                LOG.debug("Upload completed successfully");
        } catch (Exception e) {
            if (request != null) request.abort();
            throw e;
        }
    }

    private String getCsUrl() {
        if (urlProvider == null)
            urlProvider = ServiceIndex.getCSUrlProvider();
        return urlProvider.getContentServerUrl();
    }

}
