package com.opentext.otsync.tasks.rest;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class TasksAPI extends ResourceConfig {

    public TasksAPI() {
        packages("com.opentext.otsync.tasks.rest");
        register(JacksonJsonProvider.class);
    }

}
