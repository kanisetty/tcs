package com.opentext.otag.cs.dcs.api;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class DCSApi extends ResourceConfig {

    public DCSApi() {
        packages("com.opentext.otag.cs.dcs.api");
        register(JacksonJsonProvider.class);
    }

}
