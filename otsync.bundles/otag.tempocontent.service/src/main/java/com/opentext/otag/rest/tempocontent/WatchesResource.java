package com.opentext.otag.rest.tempocontent;

import com.opentext.otag.annotations.Description;
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

@Path("watches")
@Produces(MediaType.APPLICATION_JSON)
@Description(value="Operations about watches calls",notes = "All watches calls require an OTCSTICKET header")
public class WatchesResource {
  @GET
  @Description(value="Watches",summary="Get a list of current watches")
  public StreamingOutput getWatches(
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otag.watchesGet", params,
                                            new CSForwardHeaders(request)));
  }

  @POST
  @Description(value="Watches",summary="Add one or more watches.")
  public StreamingOutput addWatches(
      @FormParam("ids") @Description("comma-separated list of Content Server node ids")String ids,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("nodeIDs", "{"+ids+"}"));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otag.watchesPut", params,
                                            new CSForwardHeaders(request)));
  }

  @DELETE
  @Description(value="Watches",summary="Remove one or more watches; parameters as for POST.")
  public StreamingOutput deleteWatches(
      @FormParam("ids") String ids,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        if(ids!=null)params.add(new BasicNameValuePair("nodeIDs", "{"+ids+"}"));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otag.watchesDelete", params,
                                            new CSForwardHeaders(request)));
  }
}
