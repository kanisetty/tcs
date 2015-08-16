package com.opentext.otag.cs.workflow;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class WorkflowAPI extends ResourceConfig {

    public WorkflowAPI() {
        packages("com.opentext.otag.cs.workflow");
        register(JacksonFeature.class);
    }

}
