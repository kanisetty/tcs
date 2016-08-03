package com.opentext.otsync.dcs.api;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class DCSApi extends ResourceConfig {

    public static final String UNAVAILABLE_ERROR = "Document Conversion Service is yet to be initialised";

    public DCSApi() {
        packages("com.opentext.otsync.dcs.rest");
        register(JacksonJsonProvider.class);
    }

}
