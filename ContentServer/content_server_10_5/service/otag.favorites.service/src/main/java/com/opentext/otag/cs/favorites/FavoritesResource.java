package com.opentext.otag.cs.favorites;

import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
public class FavoritesResource {

    private static final Log LOG = LogFactory.getLog(FavoritesService.class);

    private static FavoritesService favoritesService;

    @GET
    public StreamingOutput getMyFavorites(@QueryParam("cstoken") String cstoken,
                                          @CookieParam("LLCookie") String llcookie,
                                          @Context HttpServletRequest request) {
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
        if (llcookie != null)
            cstoken = llcookie;

        if (nodeID == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST.getStatusCode());
        }

        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("nodeID", Integer.toString(nodeID)));
        return new CSRequest(getCsUrl(), "otag.favoritesDelete", cstoken, params, new ForwardHeaders(request));
    }

    /**
     * Get the Content Server URL from our managing service that has the EIM connector.
     * If we cannot resolve this URL we will return a 403.
     *
     * @return Content Server URL
     */
    private String getCsUrl() {
        if (favoritesService == null)
            favoritesService = AppworksComponentContext.getComponent(FavoritesService.class);

        if (favoritesService == null) {
            LOG.error("Unable to resolve FavoritesService");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        String csUrl = favoritesService.getCsConnection();

        if (csUrl == null) {
            LOG.error("Unable to resolve Content Server connection, all requests will be rejected");
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }

        return csUrl;
    }

}
