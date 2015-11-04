package com.opentext.otag.rest.tempocontent;


import com.opentext.otag.annotations.Description;
import com.opentext.otag.annotations.Required;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.request.SnakeResponseAdapter;
import com.opentext.otag.rest.util.CSForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("approots")
@Produces(MediaType.APPLICATION_JSON)
@Description(value="Operations about approots.", notes="All approots calls requires an OTCSTICKET header.")
public class AppRootsResource {

  @GET
  @Path("{name}")
  @Description(value="Approots",summary="Retrieve the id for an app root or system share of the given name.")
  public StreamingOutput getAppRoot(
      @PathParam("name") @Description("name of app") @Required String name,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("name", name));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.getapprootid", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Description(value="Approots",summary="Create an app root.")
  public StreamingOutput createAppRoot(
      @FormParam("name")  String name,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        if (name != null)params.add(new BasicNameValuePair("name", name));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.createapproot", params,
                                            new CSForwardHeaders(request)));
  }

  @PUT
  @Path("{id}")
  @Description(value="Operations about specific approot.",summary="Modify the app root's name.")
  public StreamingOutput changeAppRoot(
      @PathParam("id") @Required String id,
      @FormParam("name") @Required String name,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("name", name));
        params.add(new BasicNameValuePair("nodeID", id));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.changeapproot", params,
                                            new CSForwardHeaders(request)));
  }

  @DELETE
  @Path("{id}")
  @Description(value="Operations about specific approot.",summary="Remove the app root.")
  public StreamingOutput deleteAppRoot(
      @PathParam("id") @Required String id,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("nodeID", id));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.deleteapproot", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Path("{id}/visibility")
  @Description(value="Operations about the visibility of approot.",summary= "Set the visibility of an app root.",notes="If usernames and type are provided at the same time and type is public, the usernames will be ignored.")
  public StreamingOutput createVisibility(
      @PathParam("id") @Required String id,
      @FormParam("type")@Description("Private/public. Default is private. Should input either Type or user_names.") String type,
      @FormParam("user_names") @Description("User names which can see the app root.Should input either Type or user_names.")String userNames,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("id", id));
        if (type != null) params.add(new BasicNameValuePair("type", type));
        if (userNames != null) params.add(new BasicNameValuePair("userNames", userNames));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.changeapprootvisibility", params,
                                            new CSForwardHeaders(request)));
  }

  @PUT
  @Path("{id}/users/{username}")
  @Description(value="Operations about users for system share.",summary ="Add a user to a system share.",notes="Adding a user means granting that user permissions, not enabling syncing. To enable syncing of a share for some user (subscribe), accept the share as that user via the standard Tempo shares/incoming api. To disable syncing (unsubscribe), the user should delete the node using the nodes api, or delete the share using the url shares/incoming/<id>." +
      "Users may be added to either public or private shares, although adding read-only users to a public share will not have any effect unless the share is changed to private.")
  public StreamingOutput addUserToSystemShare(
      @PathParam("id") @Required String id,
      @PathParam("username") @Required String userName,
      @FormParam("is_read_only") Boolean isReadOnly,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
          params.add(new BasicNameValuePair("id", id));
          params.add(new BasicNameValuePair("username", userName));
          if(isReadOnly!= null)params.add(new BasicNameValuePair("isreadonly", Boolean.toString(isReadOnly)));

          return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.addapprootuser", params,
                                                new CSForwardHeaders(request)));
  }

  @DELETE
  @Path("{id}/users/{username}")
  @Description(value="Operations about users for system share.",summary ="Remove a user from a share.",notes="Deleting a user removes their perms and disables syncing. The behaviour is undefined if a user is deleted from a share to which they have not been added (e.g. a public share).")
  public StreamingOutput removeUserFromSystemShare(
      @PathParam("id") @Required String id,
      @PathParam("username") @Required String userName,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("id", id));
        params.add(new BasicNameValuePair("username", userName));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.removeapprootuser", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Path("{id}/users")
  @Description(value="Operations about bulk permission.",summary = "Add Bulk Perm Settings to system share or approot. The id should be the ID of system share or approot.",notes="Users may be added to either public or private shares, although adding read-only users to a public share will not have any effect unless the share is changed to private.\n" +
      "All existing share perms will be removed unless it is included in the new readUsers or writeUsers list." +
      "When the call is applied to approot, all the system shares under this approot will be set to the same perm.")
  public StreamingOutput createBulkPermission(
      @PathParam("id") @Required String id,
      @FormParam("read_users") @Description("optional list-new users to be added with read only perm.Should input either read_users or writer_users.") String readUsers,
      @FormParam("write_users") @Description("optional list-new users to be added with read write perm.Should input either read_users or writer_users.") String writeUsers,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("id", id));
        if (readUsers!= null)params.add(new BasicNameValuePair("readUsers", readUsers));
        if (writeUsers!= null)params.add(new BasicNameValuePair("writeUsers", writeUsers));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.addbulkperm", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Path("{id}/subapproots")
  @Description(value="Operations about sub approots.",summary ="Create a sub app root.")
  public StreamingOutput createSubAppRoot(
      @PathParam("id") @Description("name of app")@Required String id,
      @FormParam("name") @Required String name,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("appRoot", id));
        params.add(new BasicNameValuePair("name", name));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.createapproot", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Path("{id}/systemshares")
  @Description(value="Operations about system share.",summary = "Create a system share within an app.",notes="The ‘type’ and ‘isReadOnly’ fields together determine the permissions of the share. A public, read-only share (the default) can be browsed and subscribed to by anyone, but only the owner can modify the content. A public, read-write share can be browsed and modified by anyone. A private share is accessible only to the owner until users are added to it using the approots…users collection.")
  public StreamingOutput createSystemShares(
      @PathParam("id") @Required String id,
      @FormParam("name") @Required String name,
      @FormParam("user_name") @Required @Description("nominal owner of the new share.") String userName,
      @FormParam("type") @Required @Description("public or private") String type,
      @FormParam("is_read_only") @Required @Description( "applies only to public shares.")Boolean isReadOnly,
      @Context HttpServletRequest request){

    List<NameValuePair> params = new ArrayList<>(5);
    params.add(new BasicNameValuePair("appRoot", id));
    params.add(new BasicNameValuePair("name", name));
    params.add(new BasicNameValuePair("userName", userName));
    params.add(new BasicNameValuePair("type", type));
    params.add(new BasicNameValuePair("isreadonly", Boolean.toString(isReadOnly)));

    return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.createsystemshare", params,
                                        new CSForwardHeaders(request)));
  }

  @PUT
  @Path("systemshare/{id}")
  @Description(value="Operations about specific system share.",summary ="Modify an existing system share.",notes="Either name or type/isReadonly can be set, or both can be set at once.")
  public StreamingOutput changeSystemShare(
      @PathParam("id") @Required String id,
      @FormParam("name") String name,
      @FormParam("type") String type,
      @FormParam("is_read_only")  Boolean isReadOnly,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(4);
        params.add(new BasicNameValuePair("nodeID", id));
        if (name != null) params.add(new BasicNameValuePair("name", name));
        if (type != null)params.add(new BasicNameValuePair("type", type));
        if (isReadOnly != null)params.add(new BasicNameValuePair("isreadonly", Boolean.toString(isReadOnly)));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.changesystemshare", params, new CSForwardHeaders(request)));
  }

  @DELETE
  @Path("systemshare/{id}")
  @Description(value="Operations about specific system share.",summary ="Remove the system share.")
  public StreamingOutput deleteSystemShare(
      @PathParam("id") @Required String id,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("nodeID", id));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.deletesystemshare", params,
                                            new CSForwardHeaders(request)));
  }

  @GET
  @Path("{id}/virtualchildren")
  @Description(value="Operations about virtual children.",summary ="Get virtual children of system share or app root.")
  public StreamingOutput getVirtualChildren(
      @PathParam("id") @Required String id,
      @Context HttpServletRequest request){

    List<NameValuePair> params = new ArrayList<>(1);
    params.add(new BasicNameValuePair("id", id));

    return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.getvirtualchildren", params,
                                        new CSForwardHeaders(request)));
  }

  @POST
  @Path("{parentId}/virtualchildren/{childId}")
  @Description(value="Operations about specific virtual child.",summary ="Add virtual child to app root or system share.")
  public StreamingOutput addVirtualChildren(
      @PathParam("parentId") @Required String parentId,
      @PathParam("childId") @Required String childId,
      @Context HttpServletRequest request){

    List<NameValuePair> params = new ArrayList<>(2);
    params.add(new BasicNameValuePair("id", parentId));
    params.add(new BasicNameValuePair("virtualChildId", childId));

    return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.addvirtualchild", params,
                                        new CSForwardHeaders(request)));
  }

  @DELETE
  @Path("{parentId}/virtualchildren/{childId}")
  @Description(value="Operations about specific virtual child.",summary ="Remove virtual child from app root or system share")
  public StreamingOutput removeVirtualChildren(
      @PathParam("parentId") @Required String parentId,
      @PathParam("childId") @Required String childId,
      @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("id", parentId));
        params.add(new BasicNameValuePair("virtualChildId", childId));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otsync.removevirtualchildren", params,
                                            new CSForwardHeaders(request)));
  }
}
