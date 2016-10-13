package com.opentext.otsync.feeds.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otsync.api.CSRequestHelper;
import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class FeedGetter {

    private static final String MENTIONS = "isMentioned";
    private static final String FOLLOWING = "isFollowedUsers";
    private static final String FUNC = "func";
    private static final String AFTER = "after";
    private static final String BEFORE = "before";
    private static final String COUNT = "count";
    private static final String GET_FEED_FUNC = "otag.feedget";
    private static final String TYPE = "type";
    private static final String STATUS_TYPE = "status";
    private static final String CONTENT_TYPE = "content";

    private static final ObjectReader nodeReader = new ObjectMapper().readerFor(JsonNode.class);

    private FeedsResource.Bookmark before;
    private FeedsResource.Bookmark after;
    private int count;
    private CSForwardHeaders headers;
    private String nodeID = null;
    private String query = null;
    private Integer conversationID = null;
    private FeedItem.Provider provider = null;
    private boolean isRecursive = false;

    public FeedGetter(FeedsResource.Bookmark before, FeedsResource.Bookmark after, int count, CSForwardHeaders headers) {
        this.before = before;
        this.after = after;
        this.count = count;
        this.headers = headers;
    }

    public FeedGetter(int csBefore, int csAfter, int count, CSForwardHeaders headers) {
        FeedsResource.Bookmark before = new FeedsResource.Bookmark();
        FeedsResource.Bookmark after = new FeedsResource.Bookmark();
        before.ContentServer = csBefore;
        after.ContentServer = csAfter;
        this.before = before;
        this.after = after;
        this.count = count;
        this.headers = headers;
    }

    public FeedGetter setProvider(FeedItem.Provider provider) {
        this.provider = provider;
        return this;
    }

    public FeedGetter setNodeID(String nodeID) {
        this.nodeID = nodeID;
        return this;
    }


    public FeedGetter setConversationID(int conversationID) {
        this.conversationID = conversationID;
        return this;
    }

    public FeedGetter setRecursive(boolean isRecursive) {
        this.isRecursive = isRecursive;
        return this;
    }

    public FeedGetter setQuery(String query) {
        this.query = query;
        return this;
    }

    FeedsResource.Feed getFeed() {
        return getCSFeed();
    }

    private FeedsResource.Feed getCSFeed() {
        if (count < 1)
            throw new WebApplicationException(Status.BAD_REQUEST);

        try {
            List<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair(FUNC, GET_FEED_FUNC));
            if (after != null)
                params.add(new BasicNameValuePair(AFTER, Integer.toString(after.ContentServer)));
            if (before != null)
                params.add(new BasicNameValuePair(BEFORE, Integer.toString(before.ContentServer)));
            params.add(new BasicNameValuePair(COUNT, Integer.toString(count)));

            if (provider != null) {
                switch (provider) {
                    case PulseContent:
                        params.add(new BasicNameValuePair(TYPE, CONTENT_TYPE));
                        break;
                    case PulseStatus:
                        params.add(new BasicNameValuePair(TYPE, STATUS_TYPE));
                        break;
                    case PulseFollows:
                        params.add(new BasicNameValuePair(FOLLOWING, Boolean.toString(true)));
                        break;
                    case PulseMentions:
                        params.add(new BasicNameValuePair(MENTIONS, Boolean.toString(true)));
                        break;
                }
            }
            if (nodeID != null) {
                params.add(new BasicNameValuePair("nodeID", nodeID));
                params.add(new BasicNameValuePair("isRecursive", Boolean.toString(isRecursive)));
            }
            if (query != null)
                params.add(new BasicNameValuePair("query", query));
            if (conversationID != null)
                params.add(new BasicNameValuePair("conversationID", Integer.toString(conversationID)));

            FeedsResource.Feed feed = new FeedsResource.Feed();

            HttpPost request = new HttpPost(FeedsService.getCsUrl());
            request.setEntity(new UrlEncodedFormEntity(params));
            headers.addTo(request);

            CloseableHttpClient httpClient = HttpClientService.getService().getHttpClient();
            try (CloseableHttpResponse response = CSRequestHelper.makeRequest(httpClient, request, headers)) {
                final StatusLine status = response.getStatusLine();

                if (status.getStatusCode() != HttpStatus.SC_OK) {
                    FeedsResource.log.error("Problem getting feeds from content server: " + status.getReasonPhrase());
                    throw new WebApplicationException(status.getStatusCode());
                }

                String body = IOUtils.toString(response.getEntity().getContent());

                JsonNode root = nodeReader.readValue(body);
                feed.isMoreData = root.get("isMoreData").asBoolean();
                JsonNode itemsNode = root.get("items");
                Iterator<JsonNode> rawItems = itemsNode.elements();

                feed.items = new ArrayList<>(itemsNode.size());
                while (rawItems.hasNext()) {
                    feed.items.add(new FeedItem(rawItems.next()));
                }

                // Note: feeds must be in newest-first order
                if (feed.items.size() > 0) {
                    feed.newest = new FeedsResource.Bookmark();
                    feed.newest.ContentServer = feed.items.get(0).seqNo;
                    feed.oldest = new FeedsResource.Bookmark();
                    feed.oldest.ContentServer = feed.items.get(feed.items.size() - 1).seqNo;
                }
            }

            return feed;
        } catch (IOException e) {
            FeedsResource.log.error(e);
            throw new WebApplicationException(e, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

}