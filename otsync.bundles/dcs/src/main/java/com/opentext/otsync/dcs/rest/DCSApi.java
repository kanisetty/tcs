package com.opentext.otsync.dcs.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class DCSApi extends ResourceConfig {

    public DCSApi() {
        packages("com.opentext.otsync.dcs.rest");
        register(JacksonJsonProvider.class);
    }

}
