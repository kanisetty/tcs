package com.opentext.tempo.notifications.api;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import org.glassfish.jersey.server.ResourceConfig;

public class NotificationsAPI extends ResourceConfig {

    public NotificationsAPI() {
        packages("com.opentext.tempo.notifications.api");
        register(JacksonJsonProvider.class);
    }

}
