package com.opentext.otsync.otag.components;

import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.otag.AWComponentRegistry;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;

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

    private static final int DEFAULT_MAX_CONNS = 200;
    private static final int DEFAULT_MAX_CONNS_PER_ROUTE = 20;

    /**
     * Connection timeout used for the default request properties:
     * <p>
     * <ul>
     * <li>
     *     connect timeout - the time to establish the connection with the remote host
     * </li>
     * <li>
     *     connection request timeout - the time to wait for a connection from the
     *     connection manager/pool
     * </li>
     * <li>
     *     socket timeout - the time waiting for data – after the connection was
     *     established; maximum time of inactivity between two data packets
     * </li>
     * </ul>
     */
    private static final int DEFAULT_TIMEOUT = 30 * 1000;

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
        buildClient(DEFAULT_MAX_CONNS, DEFAULT_MAX_CONNS_PER_ROUTE,
                null, DEFAULT_TIMEOUT);
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
    public void configure(Integer maxTotal, Integer maxPerRoute) {
        buildClient(maxTotal, maxPerRoute, null, null);
    }

    /**
     * Configure the http client embedded in this service.
     *
     * @param maxTotal       max total connections
     * @param maxPerRoute    max connections per route
     * @param requestTimeout connection timeout in seconds
     */
    public void configure(Integer maxTotal, Integer maxPerRoute, Integer requestTimeout) {
        buildClient(maxTotal, maxPerRoute, null, requestTimeout);
    }

    /**
     * Configure the http client embedded in this service.
     *
     * @param maxTotal    max total connections
     * @param maxPerRoute max connections per route
     * @param ttlSeconds  time to live in seconds
     */
    public void configure(Integer maxTotal, Integer maxPerRoute, Long ttlSeconds) {
        buildClient(maxTotal, maxPerRoute, ttlSeconds, null);
    }

    /**
     * Configure the http client embedded in this service.
     *
     * @param maxTotal       max total connections
     * @param maxPerRoute    max connections per route
     * @param ttlSeconds     time to live in seconds
     * @param requestTimeout connection timeout in milliseconds
     */
    public void configure(Integer maxTotal, Integer maxPerRoute, Long ttlSeconds, Integer requestTimeout) {
        buildClient(maxTotal, maxPerRoute, ttlSeconds, requestTimeout);
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

    private void buildClient(Integer maxTotal, Integer maxPerRoute, Long ttl, Integer connectionTimeout) {
        synchronized (CLIENT_LOCK) {
            try {
                if (httpClient != null) {
                    LOG.info("Closing existing client for reconfiguration");
                    httpClient.close();
                }
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
            if (maxTotal != null)
                cm.setMaxTotal(maxTotal);
            // set max connections per route
            if (maxPerRoute != null)
                cm.setDefaultMaxPerRoute(maxPerRoute);

            // set connection timeout properties
            connectionTimeout = (connectionTimeout == null) ? DEFAULT_TIMEOUT : connectionTimeout;
            RequestConfig requestConfig = RequestConfig.custom()
                    .setConnectTimeout(connectionTimeout)
                    .setConnectionRequestTimeout(connectionTimeout)
                    .setSocketTimeout(connectionTimeout)
                    .build();

            LOG.info("Creating HTTP Client");
            LOG.info("Max Connections Per Route = " + (maxTotal != null ? maxTotal : "UNSET"));
            LOG.info("Max Connections = " + (maxPerRoute != null ? maxPerRoute : "UNSET"));
            LOG.info("Connection pool TTL (seconds) = " + (ttl != null ? ttl : "UNSET"));
            LOG.info("Connection Timeout (millis) = " + connectionTimeout);

            httpClient = HttpClients.custom()
                    .setConnectionManager(cm)
                    .setDefaultRequestConfig(requestConfig)
                    .build();
        }
    }

}
