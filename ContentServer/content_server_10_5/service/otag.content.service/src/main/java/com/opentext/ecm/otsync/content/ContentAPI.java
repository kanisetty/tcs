package com.opentext.ecm.otsync.content;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;


public class ContentAPI extends ResourceConfig {

    public ContentAPI() {
        packages("com.opentext.ecm.otsync.content");
        register(JacksonJsonProvider.class);
    }
}