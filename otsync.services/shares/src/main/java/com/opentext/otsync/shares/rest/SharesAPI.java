package com.opentext.otsync.shares.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class SharesAPI extends ResourceConfig {

    public SharesAPI() {
        packages("com.opentext.otsync.shares.rest");
        register(JacksonJsonProvider.class);
    }

}
