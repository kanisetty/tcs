package com.opentext.otsync.dcs.api;

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

@Path("nodes/{nodeID}")
public class DCSResource {

    public static final Log log = LogFactory.getLog(DCSResource.class);
    private NodeFactory nodeFactory = NodeFactory.singleton();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNumberOfPages(@PathParam("nodeID") String nodeID,
                                     @Context HttpServletRequest request) {

        try {
            Node node = nodeFactory.getOrCreateNode(nodeID);
            if (node == null)
                throw new WebApplicationException("No node was found for id " + nodeID, Response.Status.NOT_FOUND);

            int count = node.getTotalPages(nodeFactory.createCSNodeResource(nodeID, request));

            return Response.ok(count).build();
        } catch (Exception e) {
            log.error("Get page count error for " + nodeID, e);
            if (e instanceof WebApplicationException)
                throw (WebApplicationException) e;
            throw new WebApplicationException(e);
        }
    }

    @GET
    @Path("pages/{page}")
    @Produces("image/png")
    public StreamingOutput getRenderedPage(@PathParam("nodeID") String nodeID,
                                           @PathParam("page") int page,
                                           @Context HttpServletRequest request) {
        try {
            Node node = nodeFactory.getOrCreateNode(nodeID);
            if (node == null)
                throw new WebApplicationException("No node was found for id " + nodeID, Response.Status.NOT_FOUND);

            return node.getPage(page, nodeFactory.createCSNodeResource(nodeID, request));
        } catch (Exception e) {
            log.error("Get page" + page + " error for " + nodeID, e);
            if (e instanceof WebApplicationException)
                throw (WebApplicationException) e;
            throw new WebApplicationException(e);
        }
    }
}
