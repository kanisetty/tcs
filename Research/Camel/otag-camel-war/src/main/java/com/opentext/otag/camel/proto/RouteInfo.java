package com.opentext.otag.camel.proto;

import org.apache.camel.Route;

/**
 * Created by Pete on 23/05/2015.
 */
public class RouteInfo {
    private final String id;
    private final String description;
    private final String toString;

    public RouteInfo(Route route) {
        this.id = route.getId();
        this.description = route.getDescription();
        this.toString = route.toString();
    }

    public String getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getToString() {
        return toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}
