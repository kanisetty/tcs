package com.opentext.otag.cs.feeds;

import com.opentext.otag.rest.util.CSForwardHeaders;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("conversations")
@Produces(MediaType.APPLICATION_JSON)
public class Conversations {
	
	@GET
	@Path("{provider}/{conversationID}")
	public Response getConversationList(@QueryParam("before") Feeds.Bookmark before,
                                        @QueryParam("after") Feeds.Bookmark after,
                                        @QueryParam("count") @DefaultValue("20") int count,
                                        @PathParam("provider") FeedItem.Provider provider,
                                        @PathParam("conversationID") int conversationID,
                                        @Context HttpServletRequest request) {


		
		Feeds.Feed feed = new FeedGetter(before, after, count,
                new CSForwardHeaders(request)).setConversationID(conversationID).getFeed();
			
		return Response.ok(feed).build();
	}

}
