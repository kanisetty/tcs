package com.opentext.ecm.otsync.auth;

import com.opentext.otag.api.shared.types.auth.UserProfile;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.Map;

public class CSUserProfile implements UserProfile {

    private final String username;
    private final String firstname;
    private final String lastname;
    private final String fullname;
    private final String email;
    private String userID;
    private String phone = null;
    private String title = null;
    private Boolean following = null;
    private String location = null;
    private Integer userPhotoSuffix = null;
    private Long lastSeenEvent = null;
    private final boolean isAdmin;

    private static final ObjectMapper mapper = new ObjectMapper();

    public CSUserProfile(String jsonResponse, boolean isAdmin) throws IOException, NullPointerException {
        this.isAdmin = isAdmin;

        JsonNode json = mapper.readValue(jsonResponse, JsonNode.class);
        username = json.get("userName").getTextValue();
        firstname = json.get("firstName").getTextValue();
        lastname = json.get("lastName").getTextValue();
        email = json.get("email").getTextValue();
        userID = json.get("userID").asText();

        // optional fields, ok if they are null

        try { phone = json.get("phone").getTextValue(); } catch (NullPointerException ignored) {}
        try { title = json.get("userTitle").getTextValue(); } catch (NullPointerException ignored) {}
        try { following = json.get("following").getBooleanValue(); } catch (NullPointerException ignored) {}
        try { location = json.get("userLocation").getTextValue(); } catch (NullPointerException ignored) {}
        try { userPhotoSuffix = json.get("userPhotoSuffix").getIntValue(); } catch (NullPointerException ignored) {}

        fullname = firstname + " " + lastname;
    }

    @Override
    public String getUserName(){
        return username;
    }

    @Override
    public String getFirstName(){
        return firstname;
    }

    @Override
    public String getLastName(){
        return lastname;
    }

    @Override
    public String getFullName(){
        return fullname;
    }

    @Override
    public String getEmail(){
        return email;
    }

    @Override
    public String getUserID(){
        return userID;
    }

    @Override
    public String getPhone(){
        return phone;
    }

    @Override
    public String getTitle(){
        return title;
    }

    public Boolean getFollowing(){
        return following;
    }

    @Override
    public String getLocation(){
        return location;
    }

    @Override
    public Integer getUserPhotoSuffix(){
        return userPhotoSuffix;
    }

    @Override
    public void setLastSeenEvent(long seqNo) {
        lastSeenEvent = seqNo;
    }

    @Override
    public Long getLastSeenEvent() {
        return lastSeenEvent;
    }

    @Override
    public Map<String, String> getAttributes() {
        // TODO FIXME not sure what is supposed to get returned here
        return null;
    }

    @Override
    public boolean isAdmin() {
        return isAdmin;
    }

    @Override
    public void setUserID(String userID) {
        this.userID = userID;
    }

}
