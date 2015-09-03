package com.opentext.otag.cs.connector.auth;

import com.opentext.otag.api.shared.types.auth.AuthHandlerResult;
import com.opentext.otag.cs.connector.ContentServerConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

public class CSAuthHandlerResult extends AuthHandlerResult {

    private static final Log LOG = LogFactory.getLog(CSAuthHandlerResult.class);

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public CSAuthHandlerResult(String jsonResponse){
        String gotLLCookie = null;
        boolean gotIsAdmin = false;
        CSUserProfile gotUserProfile = null;
        String gotErrMsg = null;

        try {
            JsonNode json = MAPPER.readValue(jsonResponse, JsonNode.class);
            username = json.get("userName").getTextValue();
            gotLLCookie = json.get("cstoken").asText();
            gotIsAdmin = json.get("isAdmin").asBoolean();
            boolean gotIsExternal = json.get("isExternal").asBoolean();
            gotUserProfile = new CSUserProfile(jsonResponse, gotIsAdmin, gotIsExternal);
        } catch (IOException e) {
            gotErrMsg = "Invalid json response on auth attempt";
            LOG.error(gotErrMsg, e);
        } catch (NullPointerException e){
            gotErrMsg = "Missing field in json response on auth attempt";
            LOG.error(gotErrMsg, e);
        }

        addRootCookie(ContentServerConnector.CS_COOKIE_NAME, gotLLCookie);
        success = (gotLLCookie != null);
        admin = gotIsAdmin;
        errorMessage = gotErrMsg;
        userProfile = gotUserProfile;
    }

}
