package com.opentext.ecm.otsync.auth;

import com.opentext.otag.api.shared.types.auth.UserProfile;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.io.Serializable;
import java.util.Map;

public class CSUserProfile extends UserProfile {

    public static final String FOLLOWING = "following";

    private static final ObjectMapper mapper = new ObjectMapper();

    public CSUserProfile(String jsonResponse, boolean isAdmin, boolean isExternal)
            throws IOException, NullPointerException {
        this.admin = isAdmin;
        this.addProfileProperty("isExternal", String.valueOf(isExternal));

        JsonNode json = mapper.readValue(jsonResponse, JsonNode.class);
        userName = json.get("userName").getTextValue();
        firstName = json.get("firstName").getTextValue();
        lastName = json.get("lastName").getTextValue();
        email = json.get("email").getTextValue();
        userID = json.get("userID").asText();

        // optional fields, ok if they are null

        try {
            phone = json.get("phone").getTextValue();
        } catch (NullPointerException ignored) {
        }
        try {
            title = json.get("userTitle").getTextValue();
        } catch (NullPointerException ignored) {
        }
        try {
            Boolean following = json.get("following").getBooleanValue();
            setFollowing(following);
        } catch (NullPointerException ignored) {
        }
        try {
            location = json.get("userLocation").getTextValue();
        } catch (NullPointerException ignored) {
        }
        try {
            userPhotoSuffix = json.get("userPhotoSuffix").getIntValue();
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
