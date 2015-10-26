package com.opentext.ecm.otsync.content;

import com.opentext.otag.api.CSRequest;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.otag.rest.util.CSForwardHeaders;

@Path("properties")
@Produces(MediaType.APPLICATION_JSON)
public class PropertiesResource {

    @GET
    public StreamingOutput getProperties(@Context HttpServletRequest request) {

        return new CSRequest(ContentServerService.getCsUrl(), "otsync.properties", new ArrayList<>(0),
                                new CSForwardHeaders(request));
    }
}
