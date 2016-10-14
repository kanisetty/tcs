package com.opentext.otsync.api;

import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.otsync.rest.util.LLCookie;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.io.IOException;

public class CSRequestHelper {

    /**
     * Makes a request optionally including the LLCookie if present in the supplied headers.
     *
     * @param httpClient HTTP client
     * @param request request
     * @param headers HTTP headers
     * @return a closeable response to the executed request
     * @throws IOException if the request fails
     */
    public static CloseableHttpResponse makeRequest(CloseableHttpClient httpClient,
                                                    HttpPost request,
                                                    CSForwardHeaders headers) throws IOException {
        LLCookie llCookie = headers.getLLCookie();
        if (llCookie != null) {
            return httpClient.execute(request, llCookie.getContextWithLLCookie(request));
        } else {
            return httpClient.execute(request);
        }
    }

    /**
     * Determine if the exception supplied contains a 401 UNAUTHORIZED response
     * and rethrow if it does.
     *
     * @param e an exception
     * @throws WebApplicationException 401 if e is identified as such
     */
    public static void processPotential401(Exception e) throws WebApplicationException {
        if (e == null) return;
        if (e instanceof WebApplicationException) {
            WebApplicationException webEx = (WebApplicationException) e;
            if (Response.Status.UNAUTHORIZED.getStatusCode() == webEx.getResponse().getStatus())
                throw (WebApplicationException) e;
        }
    }

}
