package com.opentext.otsync.feeds.rest;

import com.opentext.otag.api.CSRequest;
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

@Path("users")
@Produces(MediaType.APPLICATION_JSON)
public class UsersResource {

	private static final String FOLLOW_FUNC = "otag.friendPost";
	private static final String UNFOLLOW_FUNC = "otag.friendDelete";
	
	@POST
	@Path("{username}/followers")
	public StreamingOutput followUser(@PathParam("username") String username,
                                      @Context HttpServletRequest request) {

		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("screen_name", username));
		return new CSRequest(FeedsService.getCsUrl(), FOLLOW_FUNC,
                params, new CSForwardHeaders(request));
	}
	
	@DELETE
	@Path("{username}/followers")
	public StreamingOutput unfollowUser(@PathParam("username") String username,
                                        @Context HttpServletRequest request) {

		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("screen_name", username));
		return new CSRequest(FeedsService.getCsUrl(), UNFOLLOW_FUNC,
                params, new CSForwardHeaders(request));
	}

}
