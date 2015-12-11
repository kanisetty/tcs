package com.opentext.otsync.shares.rest;


import com.opentext.otsync.annotations.Description;
import com.opentext.otsync.shares.request.SnakeResponseAdapter;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.otsync.api.CSRequest;
import org.apache.http.NameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("properties")
@Produces(MediaType.APPLICATION_JSON)
@Description(value="Operations about properties.", notes = "The call requires an OTCSTICKET header")
public class PropertiesResource {
  @GET
  @Description(value="Tempobox properties.", summary="Get tempobox properties.")
  public StreamingOutput getProperties(
      @Context HttpServletRequest request){

      List<NameValuePair> params = new ArrayList<>(0);

      return new SnakeResponseAdapter(new CSRequest(SharesService.getCsUrl(), "otsync.properties", params,
                                        new CSForwardHeaders(request)));
  }
}
