package com.opentext.otag.cs.dcs;

import com.opentext.otag.api.CSMultiPartRequest;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.services.client.TrustedProviderClient;
import com.opentext.otag.api.shared.types.TrustedProvider;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpUriRequest;
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
    private String csToken;
    private ForwardHeaders headers;
    private String csUrl;
    private TrustedProviderClient trustedProviderClient;

    public CSDocumentPageUploader(String nodeID, String csToken, ForwardHeaders forwardHeaders) {
        this.nodeID = nodeID;
        this.csToken = csToken;
        this.headers = forwardHeaders;
        csUrl = DocumentConversionService.getCsUrl();
        trustedProviderClient = new TrustedProviderClient();
    }

    public void upload(Integer pageNumber, String file) throws Exception {
        TrustedProvider provider = trustedProviderClient.getOrCreate("ContentServer");

        if (provider == null) throw new IOException("Unable to get ContentServer Provider");

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair(CSRequest.CSTOKEN_PARAM_NAME, csToken));
        params.add(new BasicNameValuePair(CSRequest.FUNC_PARAM_NAME, "otag.renderedpagepost"));
        params.add(new BasicNameValuePair("nodeID", nodeID));
        params.add(new BasicNameValuePair("page", Integer.toString(pageNumber)));
        params.add(new BasicNameValuePair("key", provider.getKey()));

        Long size = new File(file).length();
        HttpUriRequest request = null;
        try (InputStream in = new FileInputStream(file)) {
            HttpClient client = new HttpClient();
            request = client.getMultipartPostRequest(
                    csUrl,
                    in,
                    params,
                    "file",
                    "otag-dcs.png",
                    size);

            headers.addTo(request);

            // for SEA compatibility, we must include the llcookie
            request.addHeader("Cookie", CSMultiPartRequest.CS_COOKIE_NAME + "=" + csToken);

            HttpClient.DetailedResponse response = client.executeRequestWithDetails(request, null);

            final StatusLine statusLine = response.status;
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
