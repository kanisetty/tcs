package com.opentext.otag.cs.feeds;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.HttpClient.DetailedResponse;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

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

    private static final ObjectReader nodeReader = new ObjectMapper().reader(JsonNode.class);
    private static final HttpClient http = new HttpClient();

    private Feeds.Bookmark before;
    private Feeds.Bookmark after;
    private int count;
    private ForwardHeaders headers;
    private String nodeID = null;
    private String query = null;
    private Integer conversationID = null;
    private FeedItem.Provider provider = null;
    private boolean isRecursive = false;

    public FeedGetter(Feeds.Bookmark before, Feeds.Bookmark after, int count, ForwardHeaders headers) {
        this.before = before;
        this.after = after;
        this.count = count;
        this.headers = headers;
    }

    public FeedGetter(int csBefore, int csAfter, int count, ForwardHeaders headers) {
        Feeds.Bookmark before = new Feeds.Bookmark();
        Feeds.Bookmark after = new Feeds.Bookmark();
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

    Feeds.Feed getFeed() {
        return getCSFeed();
    }

    private Feeds.Feed getCSFeed() {
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

            Feeds.Feed feed = new Feeds.Feed();

            DetailedResponse response = http.detailedPost(FeedsService.getCsUrl(), params, headers);

            if (response.status.getStatusCode() != HttpStatus.SC_OK) {
                Feeds.log.error("Problem getting feeds from content server: " + response.status.getReasonPhrase());
                throw new WebApplicationException(response.status.getStatusCode());
            }

            JsonNode root = nodeReader.readValue(response.body);
            feed.isMoreData = root.get("isMoreData").asBoolean();
            JsonNode itemsNode = root.get("items");
            Iterator<JsonNode> rawItems = itemsNode.elements();

            feed.items = new ArrayList<>(itemsNode.size());
            while (rawItems.hasNext()) {
                feed.items.add(new FeedItem(rawItems.next()));
            }

            // Note: feeds must be in newest-first order
            if (feed.items.size() > 0) {
                feed.newest = new Feeds.Bookmark();
                feed.newest.ContentServer = feed.items.get(0).seqNo;
                feed.oldest = new Feeds.Bookmark();
                feed.oldest.ContentServer = feed.items.get(feed.items.size() - 1).seqNo;
            }

            return feed;
        } catch (IOException e) {
            Feeds.log.error(e);
            throw new WebApplicationException(e, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}