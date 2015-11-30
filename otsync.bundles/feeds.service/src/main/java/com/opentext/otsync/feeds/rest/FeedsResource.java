package com.opentext.otsync.feeds.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otag.api.CSMultiPartRequest;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Path("feeds")
@Produces(MediaType.APPLICATION_JSON)
public class FeedsResource {

    public static final Log log = LogFactory.getLog(FeedsResource.class);

    private static final ObjectReader bookmarkReader = new ObjectMapper().reader(Bookmark.class);
    public static final String POST_STATUS_FUNC = "otag.feedPost";
    private static final String LIKE_FUNC = "otag.likepost";
    private static final String GET_LIKES = "otag.likesForObject";
    private static final String UNLIKE_FUNC = "otag.likedelete";


    public static class Bookmark {
        public int ContentServer;

        public static Bookmark valueOf(String json) {
            try {
                return bookmarkReader.readValue(json);
            } catch (IOException e) {
                throw new WebApplicationException(e, Response.Status.BAD_REQUEST);
            }
        }
    }

    public static class Feed {
        public List<FeedItem> items;
        public Bookmark oldest = null;
        public Bookmark newest = null;
        public boolean isMoreData;
    }

    @GET
    public Response getAggregatedList(@QueryParam("before") Bookmark before,
                                      @QueryParam("after") Bookmark after,
                                      @QueryParam("count") @DefaultValue("20") int count,
                                      @QueryParam("query") String query,
                                      @Context HttpServletRequest request) {

        Feed feed = new FeedGetter(before, after, count, new CSForwardHeaders(request)).setQuery(query).getFeed();

        return Response.ok(feed).build();
    }

    @POST
    @Path("{provider}/{seqNo}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public StreamingOutput postCommentOnStatusPlain(@FormParam("status") String status,
                                                    @PathParam("provider") FeedItem.Provider provider,
                                                    @PathParam("seqNo") long seqNo,
                                                    @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        params.add(new BasicNameValuePair("in_reply_to_status_id", Long.toString(seqNo)));
        return new CSRequest(csUrl(), POST_STATUS_FUNC, params, new CSForwardHeaders(request));
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public StreamingOutput postStatusPlain(
            @FormParam("status") String status,
            @FormParam("lat") String lat,
            @FormParam("long") String lon,
            @Context HttpServletRequest request
    ) {

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        if (lat != null) params.add(new BasicNameValuePair("lat", lat));
        if (lon != null) params.add(new BasicNameValuePair("long", lon));
        return new CSRequest(csUrl(), POST_STATUS_FUNC, params, new CSForwardHeaders(request));
    }

    @POST
    @Path("{provider}/{seqNo}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public StreamingOutput postCommentOnStatusWithAttachment(@FormDataParam("status") String status,
                                                             @FormDataParam("file") InputStream inputStream,
                                                             @FormDataParam("file") FormDataContentDisposition fileInfo,
                                                             @PathParam("provider") FeedItem.Provider provider,
                                                             @PathParam("seqNo") long seqNo,
                                                             @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        params.add(new BasicNameValuePair("in_reply_to_status_id", Long.toString(seqNo)));

        if (fileInfo != null) {

            String filename = fileInfo.getFileName();
            if (filename != null) {
                return new CSMultiPartRequest(csUrl(), POST_STATUS_FUNC, params, inputStream, "AddDesktopDoc", filename,
                        new CSForwardHeaders(request));
            } else {
                throw new WebApplicationException(Status.BAD_REQUEST);
            }
        } else {
            return new CSRequest(csUrl(), POST_STATUS_FUNC, params, new CSForwardHeaders(request));
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public StreamingOutput postStatusWithAttachment(@FormDataParam("status") String status,
                                                    @FormDataParam("lat") String lat,
                                                    @FormDataParam("long") String lon,
                                                    @FormDataParam("file") InputStream inputStream,
                                                    @FormDataParam("file") FormDataContentDisposition fileInfo,
                                                    @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        if (lat != null) params.add(new BasicNameValuePair("lat", lat));
        if (lon != null) params.add(new BasicNameValuePair("long", lon));

        if (fileInfo != null) {

            String filename = fileInfo.getFileName();
            if (filename != null) {

                return new CSMultiPartRequest(csUrl(), POST_STATUS_FUNC, params,
                        inputStream, "AddDesktopDoc", filename,
                        new CSForwardHeaders(request));
            } else {
                throw new WebApplicationException(Status.BAD_REQUEST);
            }
        } else {
            return new CSRequest(csUrl(), POST_STATUS_FUNC, params, new CSForwardHeaders(request));
        }
    }

    @GET
    @Path("{provider}")
    public Response getProviderList(@QueryParam("before") Bookmark before,
                                    @QueryParam("after") Bookmark after,
                                    @QueryParam("count") @DefaultValue("20") int count,
                                    @QueryParam("query") String query,
                                    @PathParam("provider") FeedItem.Provider provider,
                                    @Context HttpServletRequest request) {

        Feed feed = new FeedGetter(before, after, count, new CSForwardHeaders(request))
                .setProvider(provider)
                .setQuery(query)
                .getFeed();

        return Response.ok(feed).build();
    }

    @GET
    @Path("{provider}/{seqNo}")
    public Response getFeedItem(@PathParam("provider") FeedItem.Provider provider,
                                @PathParam("seqNo") int seqNo,
                                @Context HttpServletRequest request) {

        FeedItem item = getFeedItem(provider, seqNo, new CSForwardHeaders(request));

        return Response.ok(item).build();
    }

    @GET
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput getLikes(@PathParam("provider") FeedItem.Provider provider,
                                    @PathParam("seqNo") int seqNo,
                                    @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), GET_LIKES, params, new CSForwardHeaders(request));
    }

    @POST
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput likeItem(@PathParam("provider") FeedItem.Provider provider,
                                    @PathParam("seqNo") int seqNo,
                                    @Context HttpServletRequest request) {

        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), LIKE_FUNC, params, new CSForwardHeaders(request));
    }

    @DELETE
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput unlikeItem(@PathParam("provider") FeedItem.Provider provider,
                                      @PathParam("seqNo") int seqNo,
                                      @Context HttpServletRequest request) {
        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), UNLIKE_FUNC, params, new CSForwardHeaders(request));
    }

    FeedItem getFeedItem(FeedItem.Provider provider, int seqNo, CSForwardHeaders headers) {
        Feed singletonFeed = new FeedGetter(seqNo + 1, seqNo - 1, 1,  headers)
                .setProvider(provider)
                .getFeed();
        if (singletonFeed.items.size() > 0) {
            return singletonFeed.items.get(0);
        } else {
            throw new WebApplicationException(Status.NOT_FOUND);
        }
    }

    private String csUrl() {
        return FeedsService.getCsUrl();
    }

}
