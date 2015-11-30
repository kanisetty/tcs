package com.opentext.otsync.feeds.rest;

import com.fasterxml.jackson.databind.JsonNode;

public class FeedItem {

	public enum Provider{PulseStatus, PulseContent, PulseMentions, PulseFollows}

    public String username;
	public Integer userID;
	public String firstName;
	public String lastName;
	public String userTitle;
	public String userLocation;
	public Integer id;
	public String name = null;
	public Integer subType = null;
	public String header;
	public String body;
	public String footer;
	public Integer commentCount;
	public Integer likeCount;
	public Boolean isLiked;
	public Provider feed;
    public String otagID;
	public String createDate;
	public Integer seqNo;
	public Integer conversationID;	
	public boolean isFollowing;
	public String userPhotoSuffix;
	public String attachmentMimeTypeImgURL = null;
	public String attachmentID = null;
	public String attachmentName = null;
	public Integer attachmentSubType = null;
	public Integer inReplyToSeqNo = null;
	public String inReplyToUserID = null;
	public String inReplyToUserName = null;
	public String inReplyToFirstName = null;
	public String inReplyToLastName = null;
	
	public FeedItem(JsonNode node){
		feed = Provider.valueOf(node.get("feed").asText());
		username = node.get("userName").asText(null);
		userID = node.get("userID").asInt();
		firstName = node.get("firstName").asText(null);
		lastName = node.get("lastName").asText(null);
		userTitle = node.get("userTitle").asText(null);
		userLocation = node.get("userLocation").asText(null);
		id = node.get("id").asInt();
		if (feed == Provider.PulseContent){
			name = node.get("name").asText();
			subType = node.get("subType").asInt();
		}
		header = null;
		body = node.get("body").asText();
		footer = null;
		commentCount = node.get("commentCount").asInt();
		likeCount = node.get("likeCount").asInt();
		isLiked = node.get("isLiked").asBoolean();
		otagID = null;
		createDate = node.get("createDate").asText();
		seqNo = node.get("seqNo").asInt();
		conversationID = node.get("conversationID").asInt();
		isFollowing = node.get("isFollowing").asBoolean();
		JsonNode userPhotoSuffixNode = node.get("userPhotoSuffix");
		userPhotoSuffix = userPhotoSuffixNode.isNull() ? null : userPhotoSuffixNode.asText();
		if (node.has("attachmentID") && !node.get("attachmentID").isNull()){
			attachmentID = node.get("attachmentID").asText();
			attachmentMimeTypeImgURL = node.get("attachmentMimeTypeImgURL").asText();
			attachmentName = node.get("attachmentName").asText();
			attachmentSubType = node.get("attachmentSubType").asInt();
		}
		if (node.has("inReplyTo") && !node.get("inReplyTo").isNull()){
			inReplyToSeqNo = node.get("inReplyTo").asInt();
			inReplyToUserID = node.get("inReplyToUserID").asText();
			inReplyToUserName = node.get("inReplyToUserName").asText();
			inReplyToFirstName = node.get("inReplyToUserFirstName").asText();
			inReplyToLastName = node.get("inReplyToUserLastName").asText();
		}
	}
}
