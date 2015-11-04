package com.opentext.otsync.tempocontent.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;


public class TempoContentAPI extends ResourceConfig {

    public TempoContentAPI() {
        packages("com.opentext.otsync.tempocontent.rest");
        register(JacksonJsonProvider.class);
    }

}
