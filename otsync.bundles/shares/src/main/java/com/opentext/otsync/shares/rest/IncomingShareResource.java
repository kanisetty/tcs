package com.opentext.otsync.shares.rest;


import com.opentext.otag.annotations.Description;
import com.opentext.otag.annotations.Required;
import com.opentext.otsync.shares.request.CSShareRequestBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.HashMap;
import java.util.Map;

@Path("incoming")
@Produces(MediaType.APPLICATION_JSON)
@Description(value="Operations about incoming shares.",notes = "All calls require an OTCSTICKET header")
public class IncomingShareResource {
  @GET
  @Description(value="Incoming Shares.",summary="Get pending shares.")
  public StreamingOutput getPendingShares(
      @QueryParam("count_only") @Description("get the number of pending shares")Boolean countOnly,
      @Context HttpServletRequest request){

        return new CSShareRequestBuilder()
            .subType(countOnly != null && countOnly ? "getsharelistcount" : "getsharelist")
            .request(request)
            .build();
  }

  @GET
  @Path("{nodeID}")
  @Description(value="Operation about specific incoming share.",summary="Get share info.")
  public StreamingOutput getShareInfoForNode(
      @PathParam("nodeID") @Required String nodeID,
      @Context HttpServletRequest request){

        Map<String, Object> info = new HashMap<>();
        info.put("nodeID", nodeID);

        return new CSShareRequestBuilder()
            .subType("getsharesforobject")
            .info(info)
            .request(request)
            .build();
  }

  @PUT
  @Path("{nodeID}")
  @Description(value="Operations about specific incoming share.",summary="Accept/reject share or enable/disable emails",notes="Only one of the following three parameters(accepted,rejected,notify) may be included. ")
  public StreamingOutput acceptShare(
      @PathParam("nodeID") @Required String nodeID,
      @FormParam("accepted") Boolean accepted,
      @FormParam("rejected") Boolean rejected,
      @FormParam("notify") Boolean notify,
      @Context HttpServletRequest request){

        Map<String, Object> info = new HashMap<>();
        info.put("nodeID", nodeID);

        String subType;
        if (notify!=null && notify) {
          info.put("notify", notify);
          subType = "setsharenotify";
        } else if (accepted !=null && accepted) {
          subType = "acceptsharerequest";
        } else {
          subType = "rejectsharerequest";
        }

        return new CSShareRequestBuilder()
            .subType(subType)
            .info(info)
            .request(request)
            .build();
  }

  @DELETE
  @Path("{nodeID}")
  @Description(value = "Operations about specific incoming share.",summary="Unsubscribe share.")
  public StreamingOutput unsubscribeShare(
      @PathParam("nodeID") @Required String nodeID,
      @Context HttpServletRequest request){

        Map<String, Object> info = new HashMap<String, Object>();
        info.put("nodeID", nodeID);

        return new CSShareRequestBuilder()
            .subType("unsubscribe")
            .info(info)
            .request(request)
            .build();
  }
}
