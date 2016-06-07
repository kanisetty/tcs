package com.opentext.tempo.external.invites.otds;

import com.opentext.otag.sdk.util.StringUtil;
import com.opentext.tempo.external.invites.web.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

public class OtdsClient extends RestClient {

    @FunctionalInterface
    private interface WebRequest {
        Response execute(String otdsTicket);
    }

    private static final Pattern URL_REGEX = java.util.regex.Pattern.compile("^(.*:)//([A-Za-z0-9\\-\\.]+)(:[0-9]+)?(.*)$");
    private static final Logger LOG = LoggerFactory.getLogger(OtdsClient.class);

    private final String adminPassword;
    private final String adminName;
    private String restTicket;

    public OtdsClient(String otdsUrl, String otdsAdminName, String otdsAdminPassword) {
        super(extractHost(otdsUrl));
        this.adminName = otdsAdminName;
        this.adminPassword = otdsAdminPassword;
    }

    private static String extractHost(String otdsUrl) {
        if (StringUtil.isNullOrEmpty(otdsUrl)) {
            LOG.error("Not otdsUrl specified - null or empty");
        }
        LOG.debug("Received OTDS URL: " + otdsUrl);
        if (!URL_REGEX.matcher(otdsUrl).find()) {
            LOG.error("Malformed OTDS URL: " + otdsUrl);
            // todo - proper exception handling
            throw new RuntimeException("Malformed OTDS URL");
        }
        String ret = URL_REGEX.matcher(otdsUrl).replaceFirst("$1//$2$3");
        LOG.info("Using OTDS URL: " + ret);
        return ret;
    }

    @Override
    public <R> R get(final String path, final Map<String, String> queryParams, final Map<String, String> headers,
                     final GenericType<R> entityType) {
        return execute(entityType, otdsTicket -> buildRequest(path, queryParams, otdsTicket, headers).get());
    }

    @Override
    public <R> R post(String path, Map<String, String> queryParams, Map<String, String> headers,
                     Object toPost, GenericType<R> returnType) {
        return execute(returnType, otdsTicket -> buildRequest(path, queryParams, otdsTicket, headers)
                .post(Entity.entity(toPost, MediaType.APPLICATION_JSON_TYPE)));
    }

    @Override
    public <R> R put(String path, Map<String, String> queryParams, Map<String, String> headers,
                     Object toPut, GenericType<R> returnType) {
        return execute(returnType, otdsTicket -> buildRequest(path, queryParams, otdsTicket, headers)
                .put(Entity.entity(toPut, MediaType.APPLICATION_JSON_TYPE)));
    }

    private <R> R execute(GenericType<R> entityType, WebRequest request) {
        String myTicket = getTicket();
        Response response = request.execute(myTicket);
        if (response.getStatus() == Response.Status.UNAUTHORIZED.getStatusCode()) {
            myTicket = renewTicket(myTicket);
            response = request.execute(myTicket);
        }
        return returnEntity(entityType, response);
    }

    private String renewTicket(String myTicket) {
        synchronized (this) {
            if (Objects.equals(myTicket, this.restTicket)) {
                renewRestTicket();
                myTicket = this.restTicket;
            }
        }
        return myTicket;
    }

    private String getTicket() {
        String myTicket = this.restTicket;
        if (myTicket == null) {
            synchronized (this) {
                if (this.restTicket == null) {
                    renewRestTicket();
                }
                myTicket = this.restTicket;
            }
        }
        return myTicket;
    }

    private void renewRestTicket() {
        Response response = restClient.target(host).path(composeOtdsRestPath("authentication/credentials")).request()
                .post(Entity.entity(new AuthRequestObject(adminName, adminPassword), MediaType.APPLICATION_JSON_TYPE));
        if (response.getStatus() != 200) {
            String msg = "Error authenticating with OTDS, received HTTP status " + response.getStatus() + " " +
                    response.getStatusInfo().getReasonPhrase();
            LOG.error(msg + " " + response.getStatusInfo().getReasonPhrase());
            // todo proper exception handling
            throw new RuntimeException(msg);
        }
        this.restTicket = response.readEntity(AuthResponse.class).getTicket();
    }

    private String composeOtdsRestPath(String path) {
        return "/otdsws/rest/" + (path.startsWith("/") ? path.substring(1) : path);
    }

    private Invocation.Builder buildRequest(String path, Map<String, String> queryParams, String myTicket,
                                            Map<String, String> headers) {
        return super.buildRequest(composeOtdsRestPath(path), queryParams,
                addHeader(headers, "OTDSTicket", myTicket));
    }



}
