package com.opentext.otag.camel.proto.routebuilders;

import com.opentext.otag.camel.proto.ProxyRoute;
import org.springframework.http.MediaType;

/**
 * Created by Pete on 23/05/2015.
 */
public class ProxyRestServiceBuilder extends AbstractRouteBuilder {

    @Override
    public void configure() throws Exception {

        super.configure();

        rest("/services/proxy")
                .description("List installed paths")
                .consumes(MediaType.APPLICATION_JSON_VALUE)
                .produces(MediaType.APPLICATION_JSON_VALUE)
        .get()
                .description("Get installed paths")
                .outTypeList(ProxyRoute.class)
                .to("bean:proxyRoutesService?method=listRoutes")
        .post()
                .description("Create a new proxy route")
                .type(ProxyRoute.class)
                .outType(ProxyRoute.class)
                .to("bean:proxyRoutesService?method=createRoute")
        .delete()
                .description("Delete a new proxy route")
                .type(String.class)
                .to("bean:proxyRoutesService?method=deleteRoute");


    }

}
