package com.opentext.otsync.workflow.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class WorkflowAPI extends ResourceConfig {

    public WorkflowAPI() {
        packages("com.opentext.otsync.workflow.rest");
        register(JacksonJsonProvider.class);
    }

}
