package com.opentext.tempo.external.invites.persistence;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import com.opentext.otag.sdk.util.UrlPathUtil;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Objects;

class InvitationHandlerClient {

    private static final String SERVICE_BASE_PATH = "/tempoinvitehandler/api/v1/";
    private static final String REST_API_BASE = SERVICE_BASE_PATH + "invitations";

    private Client httpClient;

    public final String otagBaseUrl;

    public InvitationHandlerClient(String otagBaseUrl) {
        this(otagBaseUrl, null);
    }

    public InvitationHandlerClient(String otagBaseUrl, Client httpClient) {
        Objects.requireNonNull(otagBaseUrl, "Gateway base URL is required");
        this.otagBaseUrl = otagBaseUrl;

        if (httpClient != null) {
            this.httpClient = httpClient;
        } else {
            this.httpClient = ClientBuilder.newClient()
                    .register(JacksonJsonProvider.class);
        }
    }

    public Response createExternalUserInOTDS(String trustedProviderKey,
                                             String email,
                                             String password) {
        Form form = new Form();
        form.param("key", trustedProviderKey);
        form.param("email", email);
        form.param("password", password);

        String registerUrl = otagBaseUrl + REST_API_BASE + "/create";
        WebTarget target = httpClient.target(UrlPathUtil.getBaseUrl(registerUrl))
                .path(UrlPathUtil.getPath(registerUrl));

        return target.request()
                .post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED));
    }

    public Response inviteExternalUser(String trustedProviderKey,
                                       String email,
                                       String firstName,
                                       String lastName,
                                       String folderName,
                                       String folderDesc,
                                       String extraInfo,
                                       String lang) {
        // invite a user that already exists in OTDS or CS
        Form form = new Form();
        form.param("key", trustedProviderKey);
        form.param("email", email);
        form.param("firstName", firstName);
        form.param("lastName", lastName);
        form.param("folderName", folderName);
        form.param("folderDesc", folderDesc);
        form.param("extraInfo", extraInfo);
        form.param("lang", lang);

        String registerUrl = otagBaseUrl + REST_API_BASE;
        WebTarget target = httpClient.target(UrlPathUtil.getBaseUrl(registerUrl))
                .path(UrlPathUtil.getPath(registerUrl));

        // POST x-www-form-urlencoded
        return target.request()
                .post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED));
    }
}
