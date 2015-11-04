package com.opentext.otag.rest.tempocontent;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;


public class TempoContentAPI extends ResourceConfig {

    public TempoContentAPI() {
        packages("com.opentext.otag.rest.tempocontent");
        register(JacksonJsonProvider.class);
    }

}
