package com.opentext.otag.cs.workflow;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class WorkflowAPI extends ResourceConfig {

    public WorkflowAPI() {
        packages("com.opentext.otag.cs.workflow");
        register(JacksonJsonProvider.class);
    }

}
