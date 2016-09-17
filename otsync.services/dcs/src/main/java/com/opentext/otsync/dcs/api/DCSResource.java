package com.opentext.otsync.dcs.api;

import com.opentext.otsync.dcs.cs.CSNodeResource;
import com.opentext.otsync.dcs.cs.node.NodeFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

/**
 * DCS API controller -
 * This service will trigger a conversion process for a given node (and it pages) when
 * asked about it if the node has not already been converted.
 */
@Path("nodes/{nodeID}")
public class DCSResource {

    public static final Log log = LogFactory.getLog(DCSResource.class);
    private NodeFactory nodeFactory = NodeFactory.singleton();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNumberOfPages(@PathParam("nodeID") String nodeID,
                                     @Context HttpServletRequest request) {

        try {
            CSNodeResource nodeResource = nodeFactory.createCSNodeResource(nodeID, request);
            int count = nodeFactory.getOrCreateNode(nodeID)
                    .getTotalPages(nodeResource);

            return Response.ok(count).build();
        } catch (Exception e) {
            String errMsg = "Failed to get page count for node " + nodeID;
            log.error(errMsg, e);
            if (e instanceof WebApplicationException)
                throw (WebApplicationException) e;
            throw new WebApplicationException(errMsg);
        }
    }

    @GET
    @Path("pages/{page}")
    @Produces("image/png")
    public StreamingOutput getRenderedPage(@PathParam("nodeID") String nodeID,
                                           @PathParam("page") int page,
                                           @Context HttpServletRequest request) {
        try {
            CSNodeResource nodeResource = nodeFactory.createCSNodeResource(nodeID, request);
            return nodeFactory.getOrCreateNode(nodeID)
                    .getPage(page, nodeResource);
        } catch (Exception e) {
            String errMsg = "Failed to get page" + page + " for node " + nodeID;
            log.error(errMsg, e);
            if (e instanceof WebApplicationException)
                throw (WebApplicationException) e;
            throw new WebApplicationException(errMsg);
        }
    }

}
