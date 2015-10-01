package com.opentext.otag.cs.connector.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otag.api.shared.types.auth.AuthHandlerResult;
import com.opentext.otag.cs.connector.ContentServerConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;

public class CSAuthHandlerResult extends AuthHandlerResult {

    private static final Log LOG = LogFactory.getLog(CSAuthHandlerResult.class);

    public static final String CSTOKEN = "cstoken";
    public static final String IS_ADMIN = "isAdmin";
    public static final String USER_NAME = "userName";
    public static final String CS_USER_NAME = "csUsername";
    public static final String USER_ID = "userID";
    public static final String CS_USER_ID = "csUserId";

    public static final String IS_EXTERNAL = "isExternal";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public CSAuthHandlerResult(String jsonResponse) {
        String gotLLCookie = null;
        boolean gotIsAdmin = false;
        CSUserProfile gotUserProfile = null;
        String gotErrMsg = null;

        try {
            JsonNode json = MAPPER.readValue(jsonResponse, JsonNode.class);
            username = json.get(USER_NAME).asText();
            gotLLCookie = json.get(CSTOKEN).asText();
            gotIsAdmin = json.get(IS_ADMIN).asBoolean();
            boolean gotIsExternal = json.get(IS_EXTERNAL).asBoolean();
            gotUserProfile = new CSUserProfile(jsonResponse, gotIsAdmin, gotIsExternal);

            addResponseBodyContent(json);
        } catch (IOException e) {
            gotErrMsg = "Invalid json response on auth attempt";
            LOG.error(gotErrMsg, e);
        } catch (NullPointerException e) {
            gotErrMsg = "Missing field in json response on auth attempt";
            LOG.error(gotErrMsg, e);
        }

        addRootCookie(ContentServerConnector.CS_COOKIE_NAME, gotLLCookie);
        success = (gotLLCookie != null);
        admin = gotIsAdmin;
        errorMessage = gotErrMsg;
        userProfile = gotUserProfile;
    }

    private void addResponseBodyContent(JsonNode json) {
        String csToken = json.get(CSTOKEN).asText();
        if (csToken != null)
            addResponseField(CSTOKEN, csToken);
        String csUsername = json.get(USER_NAME).asText();
        if (csUsername != null)
            addResponseField(CS_USER_NAME, csUsername);
        String csUserId = json.get(USER_ID).asText();
        if (csUserId != null)
            addResponseField(CS_USER_ID, csUserId);
    }

}
