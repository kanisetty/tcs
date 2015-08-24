package com.opentext.otag.cs.feeds;

import com.opentext.otag.api.CSMultiPartRequest;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import com.opentext.otag.cs.feeds.FeedItem.Provider;
import com.opentext.otag.cs.feeds.Feeds.Bookmark;
import com.opentext.otag.cs.feeds.Feeds.Feed;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Path("nodes")
@Produces(MediaType.APPLICATION_JSON)
public class Nodes {
	
	@GET
	@Path("{provider}/{nodeID}")
	public Response getFeedForObject(@QueryParam("cstoken") String cstoken,
                                     @CookieParam("LLCookie") String llcookie,
                                     @QueryParam("before") Bookmark before,
                                     @QueryParam("after") Bookmark after,
                                     @QueryParam("count") @DefaultValue("20") int count,
                                     @QueryParam("isRecursive") @DefaultValue("false") boolean isRecursive,
                                     @PathParam("provider") Provider provider,
                                     @PathParam("nodeID") String nodeID,
                                     @Context HttpServletRequest request) {
		if(llcookie != null) cstoken = llcookie;
		
		Feed feed = new FeedGetter(before, after, count, cstoken, new ForwardHeaders(request))
					.setNodeID(nodeID)
					.setRecursive(isRecursive)
					.setProvider(provider)
					.getFeed();
		
		return Response.ok(feed).build();
	}
	
	@POST
	@Path("{provider}/{nodeId}")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public StreamingOutput postCommentOnNodePlain(@QueryParam("cstoken") String cstoken,
                                                  @CookieParam("LLCookie") String llcookie,
                                                  @FormParam("status") String status,
                                                  @PathParam("provider") Provider provider,
                                                  @PathParam("nodeId") long nodeId,
                                                  @Context HttpServletRequest request) {
		if(llcookie != null) cstoken = llcookie;
		List<NameValuePair> params = new ArrayList<>(5);
		params.add(new BasicNameValuePair("status", status));
		params.add(new BasicNameValuePair("in_comment_on_obj_id", Long.toString(nodeId)));
		return new CSRequest(FeedsService.getCsUrl(), Feeds.POST_STATUS_FUNC,
                cstoken, params, new ForwardHeaders(request));
	}
	
	@POST
	@Path("{provider}/{nodeId}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public StreamingOutput postCommentOnNodeWithAttachment(@QueryParam("cstoken") String cstoken,
                                                           @CookieParam("LLCookie") String llcookie,
                                                           @FormDataParam("status") String status,
                                                           @FormDataParam("file") InputStream inputStream,
                                                           @FormDataParam("file") FormDataContentDisposition fileInfo,
                                                           @PathParam("provider") Provider provider,
                                                           @PathParam("nodeId") long nodeId,
                                                           @Context HttpServletRequest request) {
		if(llcookie != null)
            cstoken = llcookie;
		
		List<NameValuePair> params = new ArrayList<>(5);
		params.add(new BasicNameValuePair("status", status));
		params.add(new BasicNameValuePair("in_comment_on_obj_id", Long.toString(nodeId)));

        String csUrl = FeedsService.getCsUrl();

		if(fileInfo != null) {
			String filename = fileInfo.getFileName();
			if(filename != null){
				return new CSMultiPartRequest(csUrl, Feeds.POST_STATUS_FUNC, cstoken, params,
						inputStream, "AddDesktopDoc", filename,
						new ForwardHeaders(request));
			} else {
				throw new WebApplicationException(Status.BAD_REQUEST);
			}
		} else {
			return new CSRequest(csUrl, Feeds.POST_STATUS_FUNC, cstoken,
					params, new ForwardHeaders(request));
		}		
	}

}
