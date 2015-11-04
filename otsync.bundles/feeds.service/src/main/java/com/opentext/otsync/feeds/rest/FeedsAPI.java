package com.opentext.otsync.feeds.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class FeedsAPI extends ResourceConfig {

    public FeedsAPI() {
        packages("com.opentext.otsync.feeds.rest");
        register(JacksonJsonProvider.class);
        register(MultiPartFeature.class);
    }

}
