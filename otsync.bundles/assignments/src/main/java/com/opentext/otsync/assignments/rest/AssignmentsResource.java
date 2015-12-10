package com.opentext.otsync.assignments.rest;

import com.opentext.otsync.api.CSRequest;
import com.opentext.otsync.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;

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
    public StreamingOutput getMyAssignments(@Context HttpServletRequest request) {

        return new CSRequest(AssignmentsService.getCsUrl(), GET_MY_ASSIGNMENTS_FUNC,
                new ArrayList<>(), new CSForwardHeaders(request));
    }
}
