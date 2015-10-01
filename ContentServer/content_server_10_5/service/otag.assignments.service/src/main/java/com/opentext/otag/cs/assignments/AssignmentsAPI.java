package com.opentext.otag.cs.assignments;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class AssignmentsAPI extends ResourceConfig {

    public AssignmentsAPI() {
        packages("com.opentext.otag.cs.assignments");
        register(JacksonJsonProvider.class);
    }

}
