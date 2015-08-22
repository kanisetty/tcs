package com.opentext.ecm.otsync.auth;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.services.handlers.AbstractAuthRequestHandler;
import com.opentext.otag.api.services.handlers.AuthResponseDecorator;
import com.opentext.otag.api.shared.types.auth.AuthHandlerResult;
import com.opentext.otag.api.shared.types.auth.FailedAuthHandlerResult;
import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Content Server authentication handler, makes use of the available cs functions
 * to retrieve tokens. Can accept OTDS tickets as well as username/password credentials.
 * We expect any username value passed to us to be resolved against the CS OTDS partition
 * if available.
 */
@AuthResponseDecorator
public class ContentServerAuthHandler extends AbstractAuthRequestHandler {

    private static final Log LOG = LogFactory.getLog(ContentServerAuthHandler.class);

    public static final String OTAG_AUTH_FUNC = "otag.auth";
    public static final String GET_OTDS_RESOURCEID_FUNC = "otdsintegration.getresourceid";

    private static final HttpClient client = new HttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public AuthHandlerResult auth(String otdsticket, ForwardHeaders headers) {
        String csUrl = getCsUrl();
        if (csUrl == null) {
            String errMsg = "No content server url defined for authorization";
            LOG.warn(errMsg);
            return new FailedAuthHandlerResult(errMsg);
        }

        try {
            List<NameValuePair> params;
            params = new ArrayList<>();
            params.add(new BasicNameValuePair("func", OTAG_AUTH_FUNC));
            params.add(new BasicNameValuePair("otdsticket", otdsticket));
            String json = client.post(csUrl, params, headers);
            return new CSAuthHandlerResult(json);
        } catch (IOException e) {
            String errMsg = "Failed auth: " + e.getMessage();
            LOG.warn(errMsg);
            return new FailedAuthHandlerResult(errMsg);
        }
    }

    @Override
    public AuthHandlerResult auth(String username, String password, ForwardHeaders headers) {
        String csUrl = getCsUrl();
        if (csUrl == null) {
            String errMsg = "No content server url defined for authorization";
            LOG.warn(errMsg);
            return new FailedAuthHandlerResult(errMsg);
        }

        try {
            List<NameValuePair> params;
            params = new ArrayList<>();
            params.add(new BasicNameValuePair("func", OTAG_AUTH_FUNC));
            params.add(new BasicNameValuePair("username", username));
            params.add(new BasicNameValuePair("password", password));
            String json = client.post(csUrl, params, headers);
            return new CSAuthHandlerResult(json); // TODO WE SEEM TO GET A RESULT BUT TIS BLOWS UP!!!!
        } catch (IOException e) {
            String errMsg = "Failed auth by " + username + ": " + e.getMessage();
            LOG.warn(errMsg);
            return new FailedAuthHandlerResult(errMsg);
        }
    }

    @Override
    public boolean resolveUsernamesViaOtdsResource() {
        // we may have a related OTDS partition if CS auth is using OTDS
        return true;
    }

    @Override
    public String getOtdsResourceId() {
        return getCSResourceId(getCsUrl());
    }

    private String getCsUrl() {
        return ContentServerService.getCsUrl();
    }

    /**
     * Retrieve the OTDS resource Id for the Content Server instance hosted at the
     * provided URL.
     * <p>
     * CS users may or may not pass the user name by which they are known in CS
     * to the Gateway (our primary auth provider). If they do not then, in conjunction
     * with OTDS, we can lookup the name they are known by within the CS partition
     * within OTDS.
     *
     * @param csUrl content server URL
     * @return the OTDS resource id for Content Server
     */
    private String getCSResourceId(String csUrl) {
        String ret = null;

        if (!isEmpty(csUrl)) {
            ArrayList<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("func", GET_OTDS_RESOURCEID_FUNC));
            try {
                String json = client.get(csUrl, params);
                if (!isEmpty(json)) {
                    JsonNode node = OBJECT_MAPPER.readTree(new StringReader(json));
                    ret = node.get("ResourceID").asText();
                }
            } catch (Exception e) {
                LOG.error("Cannot determine CS ?func=otdsintegration.getresourceid", e);
            }
        }

        return ret;
    }

    private boolean isEmpty(String s) {
        return s == null || s.trim().length() == 0;
    }

}
