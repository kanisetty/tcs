package com.opentext.otsync.favorites.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class FavoritesAPI extends ResourceConfig {

    public FavoritesAPI() {
        packages("com.opentext.otsync.favorites.rest");
        register(JacksonJsonProvider.class);
    }

}
