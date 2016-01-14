package com.opentext.otsync.favorites.rest;

import com.opentext.otsync.api.CSRequest;
import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otsync.rest.util.CSForwardHeaders;
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
    public StreamingOutput getMyFavorites(@Context HttpServletRequest request) {

        return new CSRequest(getCsUrl(), "otag.favoritesGet", new ArrayList<>(0),  new CSForwardHeaders(request));
    }

    @POST
    public StreamingOutput addFavorite(@FormParam("nodeID") Integer nodeID,
                                       @Context HttpServletRequest request) {

        if (nodeID == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST.getStatusCode());
        }

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("nodeID", Integer.toString(nodeID)));

        return new CSRequest(getCsUrl(), "otag.favoritesAdd", params, new CSForwardHeaders(request));
    }

    @DELETE
    @Path("{nodeID}")
    public StreamingOutput deleteFavorite(@PathParam("nodeID") Integer nodeID,
                                          @Context HttpServletRequest request) {

        if (nodeID == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST.getStatusCode());
        }

        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("nodeID", Integer.toString(nodeID)));
        return new CSRequest(getCsUrl(), "otag.favoritesDelete", params, new CSForwardHeaders(request));
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
