package com.opentext.otsync.tempocontent.rest;

import com.opentext.otag.annotations.Description;
import com.opentext.otag.annotations.Required;
import com.opentext.otag.api.CSRequest;
import com.opentext.otsync.tempocontent.request.SnakeResponseAdapter;
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

@Path("events")
@Produces(MediaType.APPLICATION_JSON)
  @Description("Operations about events.")
public class EventsResource {
  @GET
  @Description(value="Events",summary="Get events",notes = "The events call requires an OTCSTICKET header.")
  public StreamingOutput getEvents(
      @QueryParam("since") @Required String since,
      @Context HttpServletRequest request){

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("since", since));

        return new SnakeResponseAdapter(new CSRequest(TempoContentService.getCsUrl(), "otag.watchEventsGet", params,
                                            new CSForwardHeaders(request)));
  }
}
