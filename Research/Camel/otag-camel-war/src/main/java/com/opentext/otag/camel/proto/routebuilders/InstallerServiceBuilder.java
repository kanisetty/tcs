package com.opentext.otag.camel.proto.routebuilders;

import com.opentext.otag.camel.proto.RouteInfo;
import org.springframework.http.MediaType;

/**
 * Created by Pete on 23/05/2015.
 */
public class InstallerServiceBuilder extends AbstractRouteBuilder {


    @Override
    public void configure() throws Exception {

        super.configure();

        rest("/services/routes")
                .description("Routes REST service")
                .consumes(MediaType.APPLICATION_JSON_VALUE)
                .produces(MediaType.APPLICATION_JSON_VALUE)
        .get()
                .description("Get routes")
                .outTypeList(RouteInfo.class)
                .to("bean:installerService?method=listRoutes")
        .post()
                .description("Install named service")
                .type(String.class)
                .outType(Boolean.class)
                .to("bean:installerService?method=installRoute")
        .delete("/{id}")
                .description("Remove the given route")
                .outType(Boolean.class)
                .to("bean:installerService?method=removeRoute(${header.id})")
        ;

    }
}
