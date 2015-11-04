package com.opentext.otag.cs.dcs.api;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class DcsApi extends ResourceConfig {

    public DcsApi() {
        packages("com.opentext.otag.cs.dcs.api");
        register(JacksonJsonProvider.class);
    }

}
