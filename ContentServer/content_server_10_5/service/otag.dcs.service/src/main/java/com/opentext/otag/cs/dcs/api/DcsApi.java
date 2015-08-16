package com.opentext.otag.cs.dcs.api;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class DcsApi extends ResourceConfig {

    public DcsApi() {
        packages("com.opentext.otag.cs.dcs.api");
        register(JacksonFeature.class);
    }

}
