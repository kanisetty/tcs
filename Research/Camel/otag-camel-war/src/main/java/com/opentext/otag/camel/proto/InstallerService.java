package com.opentext.otag.camel.proto;

import com.opentext.otag.camel.proto.routebuilders.WhatnotRouteBuilder;
import org.apache.camel.CamelContext;
import org.apache.camel.Route;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by Pete on 22/05/2015.
 */
public class InstallerService {

    @Autowired
    CamelContext camelContext;

    public Collection<RouteInfo> listRoutes() {
        List<Route> routes = camelContext.getRoutes();
        List<RouteInfo> ret = new ArrayList<>(routes.size());
        routes.forEach(r -> ret.add(new RouteInfo(r)));
        return ret;
    }

    public boolean installRoute(String name) throws Exception {
        if ("whatnots".equals(name)) {
            camelContext.addRoutes(new WhatnotRouteBuilder());
        }
        else {
            throw new IllegalArgumentException(String.valueOf(name));
        }
        return true;
    }

    public boolean removeRoute(String id) throws Exception {
        camelContext.stopRoute(id);
        return camelContext.removeRoute(id);
    }

}
