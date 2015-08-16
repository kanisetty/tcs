package com.opentext.otag.cs.favorites;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.cs.service.ContentServerAppworksServiceBase;
import com.opentext.otag.rest.util.ForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("favorites")
@Produces(MediaType.APPLICATION_JSON)
public class FavoritesService extends ContentServerAppworksServiceBase {
	
	@GET
	public StreamingOutput getMyFavorites(@QueryParam("cstoken") String cstoken,
                                          @CookieParam("LLCookie") String llcookie,
                                          @Context HttpServletRequest request) {
		validateCsUrl();
		if (llcookie != null)
            cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>(2);

        return new CSRequest(getCsUrl(), "otag.favoritesGet", cstoken, params, new ForwardHeaders(request));
	}
	
	@POST
	public StreamingOutput addFavorite(@FormParam("cstoken") String cstoken,
                                       @CookieParam("LLCookie") String llcookie,
                                       @FormParam("nodeID") Integer nodeID,
                                       @Context HttpServletRequest request) {
		validateCsUrl();
		if (llcookie != null)
            cstoken = llcookie;
		
		if (nodeID == null) {
			throw new WebApplicationException(Response.Status.BAD_REQUEST.getStatusCode());
		}
			
		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("nodeID", Integer.toString(nodeID)));
		return new CSRequest(getCsUrl(), "otag.favoritesAdd", cstoken, params, new ForwardHeaders(request));
	}
	
	@DELETE
	@Path("{nodeID}")
	public StreamingOutput deleteFavorite(@PathParam("nodeID") Integer nodeID,
										  @QueryParam("cstoken") String cstoken,
										  @CookieParam("LLCookie") String llcookie,
										  @Context HttpServletRequest request) {
		validateCsUrl();
		if (llcookie != null)
			cstoken = llcookie;
		
		if (nodeID == null) {
			throw new WebApplicationException(Response.Status.BAD_REQUEST.getStatusCode());
		}
			
		List<NameValuePair> params = new ArrayList<>(3);
		params.add(new BasicNameValuePair("nodeID", Integer.toString(nodeID)));
		return new CSRequest(getCsUrl(), "otag.favoritesDelete", cstoken, params, new ForwardHeaders(request));
	}

}
