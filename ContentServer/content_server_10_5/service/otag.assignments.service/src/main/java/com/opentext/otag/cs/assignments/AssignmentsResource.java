package com.opentext.otag.cs.assignments;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;

/**
 * Single endpoint Appworks service for retrieving a users assignments from Content Server.
 */
@Path("assignments")
@Produces(MediaType.APPLICATION_JSON)
public class AssignmentsResource {

    /**
     * Content server function name.
     */
    public static final String GET_MY_ASSIGNMENTS_FUNC = "otag.getmyassignments";

    @GET
    public StreamingOutput getMyAssignments(@QueryParam("cstoken") String cstoken,
                                            @CookieParam("LLCookie") String llcookie,
                                            @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        return new CSRequest(ContentServerAppworksServiceBase.getCsUrl(), GET_MY_ASSIGNMENTS_FUNC,
                cstoken, new ArrayList<>(), new ForwardHeaders(request));
    }

}
