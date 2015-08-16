package com.opentext.otag.cs.favorites;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class FavoritesAPI extends ResourceConfig {

    public FavoritesAPI() {
        packages("com.opentext.otag.cs.favorites");
        register(JacksonFeature.class);
    }

}
