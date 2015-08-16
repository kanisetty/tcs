package com.opentext.otag.cs.assignments;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class AssignmentsAPI extends ResourceConfig {

    public AssignmentsAPI() {
        packages("com.opentext.otag.cs.assignments");
        register(JacksonFeature.class);
    }

}
