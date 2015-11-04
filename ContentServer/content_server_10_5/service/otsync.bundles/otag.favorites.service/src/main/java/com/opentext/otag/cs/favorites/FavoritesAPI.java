package com.opentext.otag.cs.favorites;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class FavoritesAPI extends ResourceConfig {

    public FavoritesAPI() {
        packages("com.opentext.otag.cs.favorites");
        register(JacksonJsonProvider.class);
    }

}
