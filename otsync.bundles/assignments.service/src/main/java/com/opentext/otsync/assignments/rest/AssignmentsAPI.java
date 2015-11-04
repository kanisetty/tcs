package com.opentext.otsync.assignments.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class AssignmentsAPI extends ResourceConfig {

    public AssignmentsAPI() {
        packages("com.opentext.otsync.assignments.rest");
        register(JacksonJsonProvider.class);
    }

}
