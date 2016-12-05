package com.opentext.tempo.external.invites.web;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.*;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class RestClient {

    @FunctionalInterface
    private interface WebRequest {
        Response execute();
    }
    private static final Logger LOG = LoggerFactory.getLogger(RestClient.class);

    protected final String host;
    protected Client restClient;

    public RestClient(String host) {
        this.host = host;
        while (host.endsWith("/")) {
            host = host.substring(0, host.length() - 1);
        }
        this.restClient = ClientBuilder.newClient().register(JacksonJsonProvider.class);
    }

    public void close() {
        closeQuiet(restClient);
        restClient = null;
    }

    private void closeQuiet(Client client) {
        try {
            if (client != null)
                client.close();
        }
        catch (Throwable t) {
            LOG.debug("Error closing client", t);
        }
    }

    protected Invocation.Builder buildRequest(String path, Map<String, String> queryParams, Map<String, String> headers) {
        WebTarget target = restClient.target(host).path(path);
        Iterator<Map.Entry<String, String>> i = iterator(queryParams);
        while (i.hasNext()) {
            target = queryParam(target, i.next());
        }
        Invocation.Builder builder = target.request();
        i = iterator(headers);
        while (i.hasNext()) {
            builder = header(builder, i.next());
        }
        return builder;

    }

    protected Map<String, String> addHeader(Map<String, String> headers, String name, String value) {
        if (headers == null)
            headers = new HashMap<>();
        headers.put(name, value);
        return headers;
    }

    public <R> R get(String path, GenericType<R> entityType) {
        return get(path, null, null, entityType);
    }

    public <R> R get(final String path, final Map<String, String> queryParams, final Map<String, String> headers,
                     final GenericType<R> entityType) {
        return execute(entityType, () -> buildRequest(path, queryParams, headers).get());
    }

    public void post(String path, Object toPost) {
        post(path, toPost, null);
    }

    public <R> R post(String path, Object toPost, GenericType<R> returnType) {
        return post(path, null, null, toPost, returnType);
    }

    public <R> R post(String path, Map<String, String> queryParams, Map<String, String> headers,
                      Object toPost, GenericType<R> returnType) {
        return execute(returnType, () -> buildRequest(path, queryParams, headers)
                .post(Entity.entity(toPost, MediaType.APPLICATION_JSON_TYPE)));
    }

    public void put(String path, Object toPut) {
        put(path, toPut, null);
    }

    public <R> R put(String path, Object toPut, GenericType<R> returnType) {
        return put(path, null, null, toPut, returnType);
    }

    public <R> R put(String path, Map<String, String> queryParams, Map<String, String> headers,
                     Object toPut, GenericType<R> returnType) {
        return execute(returnType, () -> buildRequest(path, queryParams, headers)
                .put(Entity.entity(toPut, MediaType.APPLICATION_JSON_TYPE)));
    }

    protected <R> R execute(GenericType<R> entityType, WebRequest request) {
        return returnEntity(entityType, request.execute());
    }

    private Iterator<Map.Entry<String, String>> iterator(Map<String, String> m) {
        if (isEmpty(m)) {
            return Collections.<String, String>emptyMap().entrySet().iterator();
        }
        return m.entrySet().iterator();
    }

    private boolean isEmpty(Map m) {
        return m==null || m.isEmpty();
    }

    private Invocation.Builder header(Invocation.Builder builder, Map.Entry<String, String> e) {
        return builder.header(e.getKey(), e.getValue());
    }

    private WebTarget queryParam(WebTarget target, Map.Entry<String, String> e) {
        return target.queryParam(e.getKey(), e.getValue());
    }

    protected <R> R returnEntity(GenericType<R> entityType, Response response) {
        int status = response.getStatus();
        try {
            switch (status) {
                case 200:
                case 201:
                    return entityType == null ? null : response.readEntity(entityType);
                case 204:
                    return null;
                default:
                    try {
                        String errResponseBody = response.readEntity(String.class);
                        LOG.info("RestClient request failed - status " + status + ", body: " + errResponseBody);
                    } catch (Exception e) {
                        LOG.error("Our attempt at reading the response body failed", e);
                    }
                    if (LOG.isDebugEnabled()) {
                        LOG.debug("Received error response of status " + status + " " + response);
                    }
                    throw new WebApplicationException(status);
            }
        }
        catch (Throwable t) {
            LOG.debug("Exception handling return entity (may be expected: HTTP " + status + ")", t);
            throw new WebApplicationException(t);
        }
    }
}
