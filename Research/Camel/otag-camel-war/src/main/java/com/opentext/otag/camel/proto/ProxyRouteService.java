package com.opentext.otag.camel.proto;

import org.apache.camel.CamelContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by Pete on 23/05/2015.
 */
public class ProxyRouteService {

    @Autowired
    AWGUrlRewrite rewriter;

    @Autowired
    CamelContext camelContext;
    private Collection routes = new ArrayList<>();

    public Collection<ProxyRoute> listRoutes() {
        return rewriter.getRoutes();
    }

    public ProxyRoute createRoute(ProxyRoute route) throws Exception {
        rewriter.createRoute(route);
        this.routes.add(route);

        return route;
    }


    public void createConditionalRoute(String match, List<ProxyRoute> replaceList) throws Exception {
        rewriter.createConditionalRoute(match, replaceList);
    }
}
