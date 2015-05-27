package com.opentext.otag.camel.proto.routebuilders;

import com.opentext.otag.camel.proto.Doodad;
import org.springframework.http.MediaType;

/**
 * Created by Pete on 23/05/2015.
 */
public class DoodadRestServiceBuilder extends AbstractRouteBuilder {

    @Override
    public void configure() throws Exception {

        super.configure();

        String name = "doodads";
        rest("/services/" + name)
                .description("Doodad REST service")
                .consumes(MediaType.APPLICATION_JSON_VALUE)
                .produces(MediaType.APPLICATION_JSON_VALUE)
        .get()
                .description("Returns all the doodads")
                .outTypeList(Doodad.class)
                .to("bean:doodadService?method=listDoodads")
        .get("/{id}")
                .description("find doodad by id")
                .outType(Doodad.class)
                .to("bean:doodadService?method=getDoodad(${header.id})")
        .put()
                .description("Updates or creates a doodad")
                .type(Doodad.class)
                .outType(String.class)
                .to("bean:doodadService?method=updateDoodad")
        .post()
                .description("Updates or creates a doodad")
                .type(Doodad.class)
                .outType(String.class)
                .to("bean:doodadService?method=updateDoodad")
        ;

    }
}
