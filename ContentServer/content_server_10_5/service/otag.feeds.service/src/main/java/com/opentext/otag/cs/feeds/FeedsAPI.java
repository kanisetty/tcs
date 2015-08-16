package com.opentext.otag.cs.feeds;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class FeedsAPI extends ResourceConfig {

    public FeedsAPI() {
        packages("com.opentext.otag.cs.feeds");
        register(JacksonFeature.class);
        register(MultiPartFeature.class);
    }

}
