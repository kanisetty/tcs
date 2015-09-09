package com.opentext.otag.cs.assignments;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;

/**
 * Single endpoint Appworks service for retrieving a users assignments from Content Server.
 */
@Path("assignments")
@Produces(MediaType.APPLICATION_JSON)
public class AssignmentsResource {

    private static final Log LOG = LogFactory.getLog(AssignmentsResource.class);

    private AssignmentsService assignmentsService;

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

        return new CSRequest(getCsUrl(), GET_MY_ASSIGNMENTS_FUNC,
                cstoken, new ArrayList<>(), new ForwardHeaders(request));
    }

    private String getCsUrl() {
        if (assignmentsService != null)
            return assignmentsService.getCsConnection();

        assignmentsService = AppworksComponentContext.getComponent(AssignmentsService.class);

        if (assignmentsService != null) {
            String csConnection = assignmentsService.getCsConnection();
            if (csConnection != null)
                return csConnection;
        }

        LOG.error("Unable to service assignments request, unable to get CS connection URL");
        throw new WebApplicationException(Response.Status.FORBIDDEN);
    }

}
