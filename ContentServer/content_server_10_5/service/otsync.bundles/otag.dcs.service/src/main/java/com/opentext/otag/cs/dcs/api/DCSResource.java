package com.opentext.otag.cs.dcs.api;

import com.opentext.otag.cs.dcs.Node;
import com.opentext.otag.cs.dcs.NodeFactory;
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

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNumberOfPages(@PathParam("nodeID") String nodeID,
                                     @Context HttpServletRequest request) {

        try {
            NodeFactory nodeFactory = NodeFactory.singleton();
            Node node = nodeFactory.node(nodeID);
            int count = node.getTotalPages(nodeFactory.newCSNodeResource(nodeID, request));

            return Response.ok(count).build();
        } catch (WebApplicationException e) {
            log.error("Get page count error for " + nodeID, e);
            throw e;
        } catch (Exception e) {
            log.error("Get page count error for " + nodeID, e);
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
            NodeFactory nodeFactory = NodeFactory.singleton();
            Node node = nodeFactory.node(nodeID);

            return node.getPage(page, nodeFactory.newCSNodeResource(nodeID, request));
        } catch (WebApplicationException e) {
            log.error("Get page" + page + " error for " + nodeID, e);
            throw e;
        } catch (Exception e) {
            log.error("Get page" + page + " error for " + nodeID, e);
            throw new WebApplicationException(e);
        }
    }
}
