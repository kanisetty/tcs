package com.opentext.otag.cs.feeds;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.util.ForwardHeaders;
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
public class Users {

	private static final String FOLLOW_FUNC = "otag.friendPost";
	private static final String UNFOLLOW_FUNC = "otag.friendDelete";
	
	@POST
	@Path("{username}/followers")
	public StreamingOutput followUser(@QueryParam("cstoken") String cstoken,
                                      @CookieParam("LLCookie") String llcookie,
                                      @PathParam("username") String username,
                                      @Context HttpServletRequest request) {
		if(llcookie != null)
            cstoken = llcookie;

		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("screen_name", username));
		return new CSRequest(FeedsService.getCsUrl(), FOLLOW_FUNC, cstoken,
                params, new ForwardHeaders(request));
	}
	
	@DELETE
	@Path("{username}/followers")
	public StreamingOutput unfollowUser(@QueryParam("cstoken") String cstoken,
                                        @CookieParam("LLCookie") String llcookie,
                                        @PathParam("username") String username,
                                        @Context HttpServletRequest request) {
		if(llcookie != null)
            cstoken = llcookie;
		
		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("screen_name", username));
		return new CSRequest(FeedsService.getCsUrl(), UNFOLLOW_FUNC, cstoken,
                params, new ForwardHeaders(request));
	}

}
