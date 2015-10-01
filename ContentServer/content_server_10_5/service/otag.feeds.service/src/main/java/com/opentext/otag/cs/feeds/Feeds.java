package com.opentext.otag.cs.feeds;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otag.api.CSMultiPartRequest;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import com.opentext.otag.cs.feeds.FeedItem.Provider;
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
public class Feeds {

    public static final Log log = LogFactory.getLog(Feeds.class);

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
        public String cstoken;
        public boolean isMoreData;
    }

    @GET
    public Response getAggregatedList(@QueryParam("cstoken") String cstoken,
                                      @CookieParam("LLCookie") String llcookie,
                                      @QueryParam("before") Bookmark before,
                                      @QueryParam("after") Bookmark after,
                                      @QueryParam("count") @DefaultValue("20") int count,
                                      @QueryParam("query") String query,
                                      @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        Feed feed = new FeedGetter(before, after, count, cstoken,
                new ForwardHeaders(request)).setQuery(query).getFeed();

        return Response.ok(feed).build();
    }

    @POST
    @Path("{provider}/{seqNo}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public StreamingOutput postCommentOnStatusPlain(@QueryParam("cstoken") String cstoken,
                                                    @CookieParam("LLCookie") String llcookie,
                                                    @FormParam("status") String status,
                                                    @PathParam("provider") Provider provider,
                                                    @PathParam("seqNo") long seqNo,
                                                    @Context HttpServletRequest request) {
        if (llcookie != null)
            cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        params.add(new BasicNameValuePair("in_reply_to_status_id", Long.toString(seqNo)));
        return new CSRequest(csUrl(), POST_STATUS_FUNC, cstoken, params, new ForwardHeaders(request));
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public StreamingOutput postStatusPlain(
            @QueryParam("otagtoken") String otagtoken,
            @CookieParam("otagtoken") String otagCookie,
            @QueryParam("cstoken") String cstoken,
            @CookieParam("LLCookie") String llcookie,
            @FormParam("status") String status,
            @FormParam("lat") String lat,
            @FormParam("long") String lon,
            @Context HttpServletRequest request
    ) {
        if (llcookie != null) cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        if (lat != null) params.add(new BasicNameValuePair("lat", lat));
        if (lon != null) params.add(new BasicNameValuePair("long", lon));
        return new CSRequest(csUrl(), POST_STATUS_FUNC, cstoken, params, new ForwardHeaders(request));
    }

    @POST
    @Path("{provider}/{seqNo}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public StreamingOutput postCommentOnStatusWithAttachment(@QueryParam("cstoken") String cstokenInQuery,
                                                             @CookieParam("LLCookie") String llcookie,
                                                             @FormDataParam("cstoken") String csTokenInForm,
                                                             @FormDataParam("status") String status,
                                                             @FormDataParam("file") InputStream inputStream,
                                                             @FormDataParam("file") FormDataContentDisposition fileInfo,
                                                             @PathParam("provider") Provider provider,
                                                             @PathParam("seqNo") long seqNo,
                                                             @Context HttpServletRequest request) {
        String csToken = cstokenInQuery != null ? cstokenInQuery :
                (llcookie != null ? llcookie : csTokenInForm);

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        params.add(new BasicNameValuePair("in_reply_to_status_id", Long.toString(seqNo)));

        if (fileInfo != null) {

            String filename = fileInfo.getFileName();
            if (filename != null) {
                return new CSMultiPartRequest(csUrl(), POST_STATUS_FUNC, csToken, params,
                        inputStream, "AddDesktopDoc", filename,
                        new ForwardHeaders(request));
            } else {
                throw new WebApplicationException(Status.BAD_REQUEST);
            }
        } else {
            return new CSRequest(csUrl(), POST_STATUS_FUNC,
                    csToken, params, new ForwardHeaders(request));
        }
    }

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public StreamingOutput postStatusWithAttachment(@QueryParam("cstoken") String cstokenInQuery,
                                                    @CookieParam("LLCookie") String llcookie,
                                                    @FormDataParam("cstoken") String csTokenInForm,
                                                    @FormDataParam("status") String status,
                                                    @FormDataParam("lat") String lat,
                                                    @FormDataParam("long") String lon,
                                                    @FormDataParam("file") InputStream inputStream,
                                                    @FormDataParam("file") FormDataContentDisposition fileInfo,
                                                    @Context HttpServletRequest request) {
        String csToken = cstokenInQuery != null ? cstokenInQuery :
                (llcookie != null ? llcookie : csTokenInForm);

        List<NameValuePair> params = new ArrayList<>(5);
        params.add(new BasicNameValuePair("status", status));
        if (lat != null) params.add(new BasicNameValuePair("lat", lat));
        if (lon != null) params.add(new BasicNameValuePair("long", lon));

        if (fileInfo != null) {

            String filename = fileInfo.getFileName();
            if (filename != null) {

                return new CSMultiPartRequest(csUrl(), POST_STATUS_FUNC, csToken, params,
                        inputStream, "AddDesktopDoc", filename,
                        new ForwardHeaders(request));
            } else {
                throw new WebApplicationException(Status.BAD_REQUEST);
            }
        } else {
            return new CSRequest(csUrl(), POST_STATUS_FUNC, csToken, params, new ForwardHeaders(request));
        }
    }

    @GET
    @Path("{provider}")
    public Response getProviderList(@QueryParam("cstoken") String cstoken,
                                    @CookieParam("LLCookie") String llcookie,
                                    @QueryParam("before") Bookmark before,
                                    @QueryParam("after") Bookmark after,
                                    @QueryParam("count") @DefaultValue("20") int count,
                                    @QueryParam("query") String query,
                                    @PathParam("provider") Provider provider,
                                    @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;

        Feed feed = new FeedGetter(before, after, count, cstoken, new ForwardHeaders(request))
                .setProvider(provider)
                .setQuery(query)
                .getFeed();

        return Response.ok(feed).build();
    }

    @GET
    @Path("{provider}/{seqNo}")
    public Response getFeedItem(@QueryParam("cstoken") String cstoken,
                                @CookieParam("LLCookie") String llcookie,
                                @PathParam("provider") Provider provider,
                                @PathParam("seqNo") int seqNo,
                                @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;

        FeedItem item = getFeedItem(provider, seqNo, cstoken, new ForwardHeaders(request));

        return Response.ok(item).build();
    }

    @GET
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput getLikes(@QueryParam("cstoken") String cstoken,
                                    @CookieParam("LLCookie") String llcookie,
                                    @PathParam("provider") Provider provider,
                                    @PathParam("seqNo") int seqNo,
                                    @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;

        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), GET_LIKES, cstoken, params, new ForwardHeaders(request));
    }

    @POST
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput likeItem(@QueryParam("cstoken") String cstoken,
                                    @CookieParam("LLCookie") String llcookie,
                                    @PathParam("provider") Provider provider,
                                    @PathParam("seqNo") int seqNo,
                                    @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;
        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), LIKE_FUNC, cstoken, params, new ForwardHeaders(request));
    }

    @DELETE
    @Path("{provider}/{seqNo}/likes")
    public StreamingOutput unlikeItem(@QueryParam("cstoken") String cstoken,
                                      @CookieParam("LLCookie") String llcookie,
                                      @PathParam("provider") Provider provider,
                                      @PathParam("seqNo") int seqNo,
                                      @Context HttpServletRequest request) {
        if (llcookie != null) cstoken = llcookie;
        List<NameValuePair> params = new ArrayList<>(3);
        params.add(new BasicNameValuePair("seqNo", Integer.toString(seqNo)));
        return new CSRequest(csUrl(), UNLIKE_FUNC, cstoken, params, new ForwardHeaders(request));
    }

    FeedItem getFeedItem(Provider provider, int seqNo, String cstoken, ForwardHeaders headers) {
        Feed singletonFeed = new FeedGetter(seqNo + 1, seqNo - 1, 1, cstoken, headers)
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
