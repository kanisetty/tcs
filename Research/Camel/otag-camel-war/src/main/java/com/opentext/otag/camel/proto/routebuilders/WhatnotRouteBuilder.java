package com.opentext.otag.camel.proto.routebuilders;

import com.opentext.otag.camel.proto.Whatnot;
import org.springframework.http.MediaType;

/**
 * Created by Pete on 23/05/2015.
 */
public class WhatnotRouteBuilder extends AbstractRouteBuilder {

    @Override
    public void configure() throws Exception {

        super.configure();

        String name = "whatnots";
        rest("/services/" + name)
                .description("Whatnot REST service")
                .consumes(MediaType.APPLICATION_JSON_VALUE)
                .produces(MediaType.APPLICATION_JSON_VALUE)
        .get()
                .description("Returns all the whatnots")
                .outTypeList(Whatnot.class)
                .to("bean:whatnotService?method=listWhatnots")
        .get("/{id}")
                .description("find whatnot by id")
                .outType(Whatnot.class)
                .to("bean:whatnotService?method=getWhatnot(${header.id})")
        .put()
                .description("Updates or creates a whatnot")
                .type(Whatnot.class)
                .outType(String.class)
                .to("bean:whatnotService?method=updateWhatnot")
        .post()
                .description("Updates or creates a whatnot")
                .type(Whatnot.class)
                .outType(String.class)
                .to("bean:whatnotService?method=updateWhatnot")
        ;

    }
}
