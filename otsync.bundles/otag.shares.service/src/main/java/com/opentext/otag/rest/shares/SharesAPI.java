package com.opentext.otag.rest.shares;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class SharesAPI extends ResourceConfig {

    public SharesAPI() {
        packages("com.opentext.otag.rest.shares");
        register(JacksonJsonProvider.class);
    }

}
