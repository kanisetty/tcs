package com.opentext.otag.cs.feeds;

import org.codehaus.jackson.JsonNode;


public class FeedItem {

	public enum Provider{PulseStatus, PulseContent, PulseMentions, PulseFollows}

    public String username;
	public String userID;
	public String firstName;
	public String lastName;
	public String userTitle;
	public String userLocation;
	public String id;
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
	
	public FeedItem(){}
	
	public FeedItem(JsonNode node){
		feed = Provider.valueOf(node.get("feed").asText());
		username = node.get("userName").getTextValue();
		userID = node.get("userID").asText();
		firstName = node.get("firstName").getTextValue();
		lastName = node.get("lastName").getTextValue();
		userTitle = node.get("userTitle").getTextValue();
		userLocation = node.get("userLocation").getTextValue();
		id = node.get("id").asText();
		if (feed == Provider.PulseContent){
			name = node.get("name").asText();
			subType = node.get("subType").asInt();
		}
		header = null;
		body = node.get("body").getTextValue();
		footer = null;
		commentCount = node.get("commentCount").asInt();
		likeCount = node.get("likeCount").asInt();
		isLiked = node.get("isLiked").asBoolean();
		otagID = null;
		createDate = node.get("createDate").getTextValue();
		seqNo = node.get("seqNo").asInt();
		conversationID = node.get("conversationID").asInt();
		isFollowing = node.get("isFollowing").asBoolean();
		JsonNode userPhotoSuffixNode = node.get("userPhotoSuffix");
		userPhotoSuffix = userPhotoSuffixNode.isNull() ? null : userPhotoSuffixNode.asText();
		if (node.has("attachmentID") && !node.get("attachmentID").isNull()){
			attachmentID = node.get("attachmentID").asText();
			attachmentMimeTypeImgURL = node.get("attachmentMimeTypeImgURL").asText();
			attachmentName = node.get("attachmentName").getTextValue();
			attachmentSubType = node.get("attachmentSubType").asInt();
		}
		if (node.has("inReplyTo") && !node.get("inReplyTo").isNull()){
			inReplyToSeqNo = node.get("inReplyTo").asInt();
			inReplyToUserID = node.get("inReplyToUserID").asText();
			inReplyToUserName = node.get("inReplyToUserName").getTextValue();
			inReplyToFirstName = node.get("inReplyToUserFirstName").getTextValue();
			inReplyToLastName = node.get("inReplyToUserLastName").getTextValue();
		}
	}
}
