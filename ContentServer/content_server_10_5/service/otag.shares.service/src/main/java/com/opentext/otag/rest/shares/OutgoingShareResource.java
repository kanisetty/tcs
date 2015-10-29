package com.opentext.otag.rest.shares;


import com.opentext.otag.annotations.Description;
import com.opentext.otag.annotations.Required;
import com.opentext.otag.request.CSShareRequestBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("outgoing")
@Produces(MediaType.APPLICATION_JSON)
@Description(value="Operations about outgoing shares.",notes = "All calls require an OTCSTICKET header")
public class OutgoingShareResource {
  @GET
  @Description(value="Outgoing shares.",summary="Get shares I own.")
  public StreamingOutput getShares(
      @QueryParam("sort")  String sortOn,
      @QueryParam("desc")  Boolean sortDesc,
      @Context HttpServletRequest request){

        Map<String,Object> info = new HashMap<>();
        if (sortOn!= null)info.put("sortOn",sortOn);
        if (sortDesc!= null)info.put("sortDescending",sortDesc);

        return new CSShareRequestBuilder()
            .subType("getsharedbyuser")
            .info(info)
            .request(request)
            .build();
  }

  @GET
  @Path("{nodeID}")
  @Description(value="Operations about specific share.",summary="Get share info.")
  public StreamingOutput getShareForNode(
      @PathParam("nodeID") @Required String nodeID,
      @Context HttpServletRequest request){

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID",nodeID);

        return new CSShareRequestBuilder()
            .subType("getsharesforobject")
            .info(info)
            .request(request)
            .build();
  }

  @PUT
  @Path("{nodeID}")
  @Description(value="Operations about specific share.",summary="Enable/disable emails.")
  public StreamingOutput setNotificationForShare(
      @PathParam("nodeID") @Required String nodeID,
      @FormParam("notify") @Required boolean notify,
      @Context HttpServletRequest request){

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID", nodeID);
        info.put("notify", notify);

        return new CSShareRequestBuilder()
            .subType("setsharenotify")
            .info(info)
            .request(request)
            .build();
  }

  @DELETE
  @Path("{nodeID}")
  @Description(value="Operations about specific share.",summary="Unshare all shares.")
  public StreamingOutput unshareAllFromNode(
      @PathParam("nodeID") @Required String nodeID,
      @Context HttpServletRequest request){

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID", nodeID);

        return new CSShareRequestBuilder()
            .subType("unshareall")
            .info(info)
            .request(request)
            .build();
  }

  @POST
  @Path("{nodeID}/users/{userName}")
  @Description(value="Operations about specific user.",summary= "Create share / add collaborator.",notes="The UserName must be a string username.")
  public StreamingOutput shareToUser(@PathParam("userName") @Required String userName,
                                     @PathParam("nodeID") @Required String nodeID,
                                     @FormParam("share_type") @Description("1=>read share type;2=>write share type")@Required String shareType,
                                     @Context HttpServletRequest request) {

        Map<String,Object> userEntry = new HashMap<>();
        userEntry.put("userLogin", userName);
        userEntry.put("shareType", shareType);

        List<Map<String, Object>> userList = new ArrayList<>();
        userList.add(userEntry);

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID",nodeID);
        info.put("userList",userList);

        return new CSShareRequestBuilder()
            .subType("share")
            .info(info)
            .request(request)
            .build();
  }

  @PUT
  @Path("{nodeID}/users/{userID}")
  @Description(value="Operations about specific share with specific user.",summary="Change role.",notes="UserID must be an integer userID")
  public StreamingOutput changeShareType(@PathParam("userID") @Required String userID,
                               @PathParam("nodeID") @Required String nodeID,
                               @FormParam("share_type")@Description("1=>read share type;2=>write share type") @Required String shareType,
                               @Context HttpServletRequest request) {

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID",nodeID);
        info.put("userID",userID);
        info.put("shareType",shareType);

        return new CSShareRequestBuilder()
            .subType("changesharetype")
            .info(info)
            .request(request)
            .build();
  }

  @DELETE
  @Path("{nodeID}/users/{userName}")
  @Description(value="Operations about specific user.",summary = "Unshare with user.",notes="The UserName must be a string username.")
  public StreamingOutput unshareFromUser(@PathParam("userName") @Required String userName,
                               @PathParam("nodeID") @Required String nodeID,
                               @Context HttpServletRequest request){

        List<String> userList = new ArrayList<>();
        userList.add(userName);

        Map<String,Object> info = new HashMap<>();
        info.put("nodeID",nodeID);
        info.put("userList",userList);

        return new CSShareRequestBuilder()
            .subType("unshare")
            .info(info)
            .request(request)
            .build();
  }
}
