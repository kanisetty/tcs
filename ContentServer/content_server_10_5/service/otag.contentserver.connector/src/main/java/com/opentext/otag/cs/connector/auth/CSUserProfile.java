package com.opentext.otag.cs.connector.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otag.api.shared.types.auth.UserProfile;

import java.io.IOException;
import java.util.Map;

public class CSUserProfile extends UserProfile {

    public static final String FOLLOWING = "following";

    private static final ObjectMapper mapper = new ObjectMapper();

    public CSUserProfile(String jsonResponse, boolean isAdmin, boolean isExternal)
            throws IOException, NullPointerException {
        this.admin = isAdmin;
        this.addProfileProperty("isExternal", String.valueOf(isExternal));

        JsonNode json = mapper.readValue(jsonResponse, JsonNode.class);
        userName = json.get("userName").asText();
        firstName = json.get("firstName").asText();
        lastName = json.get("lastName").asText();
        email = json.get("email").asText();
        userID = json.get("userID").asText();

        // optional fields, ok if they are null

        try {
            phone = json.get("phone").asText();
        } catch (NullPointerException ignored) {
        }
        try {
            title = json.get("userTitle").asText();
        } catch (NullPointerException ignored) {
        }
        try {
            Boolean following = json.get("following").asBoolean();
            setFollowing(following);
        } catch (NullPointerException ignored) {
        }
        try {
            location = json.get("userLocation").asText();
        } catch (NullPointerException ignored) {
        }
        try {
            userPhotoSuffix = json.get("userPhotoSuffix").asInt();
        } catch (NullPointerException ignored) {
        }

        fullName = firstName + " " + lastName;
    }

    public boolean getFollowing() {
        String followingField = additionalProperties.get(FOLLOWING);
        return followingField != null &&
                Boolean.valueOf(followingField);
    }

    public void setFollowing(boolean following) {
        addProfileProperty(FOLLOWING, String.valueOf(following));
    }

    @Override
    public Map<String, String> getAttributes() {
        // this field is really for OTDS, read LDAP attributes
        return null;
    }
}
