package com.opentext.otsync.dcs.api;

import com.opentext.otsync.dcs.cs.CSNodeResource;
import com.opentext.otsync.dcs.cs.node.Node;
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

    private static final String CONVERSION_FAILED_MSG = "Unable to get page data, this document " +
            "has failed conversion";

    private NodeFactory nodeFactory = NodeFactory.singleton();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNumberOfPages(@PathParam("nodeID") String nodeID,
                                     @Context HttpServletRequest request) {

        try {
            CSNodeResource nodeResource = nodeFactory.createCSNodeResource(nodeID, request);
            Node node = nodeFactory.getOrCreateNode(nodeID);
            int count = node.getTotalPages(nodeResource);

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
    public Response getRenderedPage(@PathParam("nodeID") String nodeID,
                                    @PathParam("page") int page,
                                    @Context HttpServletRequest request) {
        try {
            CSNodeResource nodeResource = nodeFactory.createCSNodeResource(nodeID, request);
            Node node = nodeFactory.getOrCreateNode(nodeID);

            StreamingOutput streamingOutput;
            try {
                streamingOutput = node.getPage(page, nodeResource);
            } catch (Exception e) {
                throw new WebApplicationException(CONVERSION_FAILED_MSG, 400);
            }

            if (streamingOutput == null)
                throw new WebApplicationException(CONVERSION_FAILED_MSG, 400);

            return Response.ok(streamingOutput).build();
        } catch (Exception e) {
            String errMsg = "Failed to get page" + page + " for node " + nodeID;
            log.error(errMsg, e);
            if (e instanceof WebApplicationException)
                throw (WebApplicationException) e;
            throw new WebApplicationException(errMsg);
        }
    }

}
