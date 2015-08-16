package com.opentext.otag.cs.tasks;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class TasksAPI extends ResourceConfig {

    public TasksAPI() {
        packages("com.opentext.otag.cs.tasks");
        register(JacksonFeature.class);
    }

}
