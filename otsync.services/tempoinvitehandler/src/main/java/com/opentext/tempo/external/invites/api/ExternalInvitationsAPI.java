package com.opentext.tempo.external.invites.api;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

/**
 * Jersey JAX-RS configuration for this service.
 */
public class ExternalInvitationsAPI extends ResourceConfig {

    public ExternalInvitationsAPI() {
        packages("com.opentext.tempo.external.invites.api");
        register(JacksonJsonProvider.class);
    }

}
