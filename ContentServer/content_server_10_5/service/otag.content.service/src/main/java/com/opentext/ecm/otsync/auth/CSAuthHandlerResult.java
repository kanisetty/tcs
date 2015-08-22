package com.opentext.ecm.otsync.auth;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.otag.api.shared.types.auth.AuthHandlerResult;
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
        //boolean gotIsExternal = false;
        //CSUserProfile gotUserProfile = null;
        String gotErrMsg = null;

        try {
            JsonNode json = MAPPER.readValue(jsonResponse, JsonNode.class);
            username = json.get("userName").getTextValue();
            gotLLCookie = json.get("cstoken").asText();
            gotIsAdmin = json.get("isAdmin").asBoolean();
            //gotIsExternal = json.get("isExternal").asBoolean();
            //gotUserProfile = new CSUserProfile(jsonResponse, gotIsAdmin);
        } catch (IOException e) {
            gotErrMsg = "Invalid json response on auth attempt";
            LOG.error(gotErrMsg, e);
        } catch (NullPointerException e){
            gotErrMsg = "Missing field in json response on auth attempt";
            LOG.error(gotErrMsg, e);
        }

        addLLCookie(gotLLCookie);
        success = (gotLLCookie != null);
        admin = gotIsAdmin;
        // TODO FIXME check this out
        //isExternal = gotIsExternal;
        errorMessage = gotErrMsg;
        //userProfile = gotUserProfile;
    }

    private void addLLCookie(String cstoken) {
        addRootCookie(ContentServiceConstants.CS_COOKIE_NAME, cstoken);
    }

}
