package com.opentext.otag.cs.tasks;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class TasksAPI extends ResourceConfig {

    public TasksAPI() {
        packages("com.opentext.otag.cs.tasks");
        register(JacksonJsonProvider.class);
    }

}
