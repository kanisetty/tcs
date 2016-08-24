package com.opentext.otsync.otag.components;

import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.otag.AWComponentRegistry;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.pool.ConnPoolControl;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Wraps our default HTTP client that should be used by the OTSync services.
 * This will be auto-deployed as a {@link AWComponent} into the context for
 * each service as it implements the {@link AWServiceContextHandler} interface.
 */
public class HttpClientService implements AWServiceContextHandler {

    public static final Log LOG = LogFactory.getLog(CSRequest.class);

    /**
     * Apache HTTP client.
     */
    private CloseableHttpClient httpClient;

    private static final Object CLIENT_LOCK = new Object();

    /**
     * Provide static access via the component context for ease of use, the AW
     * component context is centralised anyway per web context. This method fails
     * fast too if the component wasn't registered.
     *
     * @return HTTP Client Service instance
     * @throws javax.ws.rs.WebApplicationException a 503 error is thrown if the service
     *                                             is not in the context
     */
    public static HttpClientService getService() {
        return AWComponentRegistry.getComponent(HttpClientService.class, "HttpClientService");
    }

    @Override
    public void onStart(String appName) {
        LOG.info("Initialising HttpClientService HTTP client");
        // default values
        int maxTotal = 200;
        int maxPerRoute = 20;

        buildClient(maxTotal, maxPerRoute, null);
    }

    public CloseableHttpClient getHttpClient() {
        return httpClient;
    }

    /**
     * Configure the http client embedded in this service.
     *
     * @param maxTotal    max total connections
     * @param maxPerRoute max connections per route
     */
    public void configure(int maxTotal, int maxPerRoute) {
        buildClient(maxTotal, maxPerRoute, null);
    }

    /**
     * Configure the http client embedded in this service.
     *
     * @param maxTotal    max total connections
     * @param maxPerRoute max connections per route
     * @param ttlSeconds  time to live in seconds
     */
    public void configure(int maxTotal, int maxPerRoute, Long ttlSeconds) {
        buildClient(maxTotal, maxPerRoute, ttlSeconds);
    }

    @Override
    public void onStop(String appName) {
        // shut down our HTTP client
        try {
            LOG.info("Shutting down HttpClientService HTTP client");
            if (httpClient != null)
                httpClient.close();
        } catch (IOException e) {
            LOG.error("Failed to close our HTTP client successfully", e);
        }
    }

    private void buildClient(int maxTotal, int maxPerRoute, Long ttl) {
        synchronized (CLIENT_LOCK) {
            try {
                if (httpClient != null)
                    httpClient.close();
            } catch (Exception e) {
                LOG.error("Failed to shut down the existing http client gracefully", e);
            }

            PoolingHttpClientConnectionManager cm;
            if (ttl != null) {
                cm = new PoolingHttpClientConnectionManager(ttl, TimeUnit.SECONDS);
            } else {
                cm = new PoolingHttpClientConnectionManager();
            }

            // set max total connections
            cm.setMaxTotal(maxTotal);
            // set max connections per route
            cm.setDefaultMaxPerRoute(maxPerRoute);

            httpClient = HttpClients.custom()
                    .setConnectionManager(cm)
                    .build();
        }
    }

}
