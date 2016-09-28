package com.opentext.otsync.connector.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otag.sdk.handlers.AbstractAuthRequestHandler;
import com.opentext.otag.sdk.handlers.AuthResponseDecorator;
import com.opentext.otag.sdk.types.v3.auth.AuthHandlerResult;
import com.opentext.otag.sdk.types.v3.client.ClientRepresentation;
import com.opentext.otag.sdk.util.Cookie;
import com.opentext.otag.sdk.util.ForwardHeaders;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.api.HttpClient;
import com.opentext.otsync.connector.OTSyncConnector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * OTSync authentication handler, makes use of the available cs functions
 * to retrieve tokens. Can accept OTDS tickets as well as username/password credentials.
 * We expect any username value passed to us to be resolved against the CS OTDS partition
 * if available.
 */
@AuthResponseDecorator
public class OTSyncAuthHandler extends AbstractAuthRequestHandler {

    private static final Log LOG = LogFactory.getLog(OTSyncAuthHandler.class);

    private static final String OTAG_AUTH_FUNC = "otag.auth";
    private static final String GET_OTDS_RESOURCEID_FUNC = "otdsintegration.getresourceid";

    private static final HttpClient client = new HttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Connector housing this handler. It retains the connection to Content Server itself.
     */
    private OTSyncConnector connector;

    // TODO FIXME - Make use of the requested ClientRepresentation
    @Override
    public AuthHandlerResult auth(String otdsticket, ForwardHeaders headers, ClientRepresentation clientDat) {
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
            return new OTSyncAuthHandlerResult(json);
        } catch (IOException e) {
            String errMsg = "Failed auth: " + e.getMessage();
            LOG.warn(errMsg);
            return new FailedAuthHandlerResult(errMsg);
        }
    }

    // TODO FIXME - Make use of the requested ClientRepresentation
    @Override
    public AuthHandlerResult auth(String username, String password, ForwardHeaders headers, ClientRepresentation clientDat) {
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
            return new OTSyncAuthHandlerResult(json);
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

    @Override
    public Set<Cookie> getKnownCookies() {
        Set<Cookie> cookies = new HashSet<>();

        Cookie llCookie = new Cookie(OTSyncConnector.CS_COOKIE_NAME, "");
        llCookie.setPath("/");
        llCookie.setHttpOnly(true);
        cookies.add(llCookie);

        return cookies;
    }

    /**
     * Safely return the Content Server URL if our connector has been setup
     * or null, otherwise.
     *
     * @return Content Server URL
     */
    private String getCsUrl() {
        // grab the reference to the connector from our AW context
        if (connector == null)
            connector = AWComponentContext.getComponent(OTSyncConnector.class);

        return (connector != null) ? connector.getConnectionString() : null;
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
                    // TODO FIXME update setting value
                }
            } catch (Exception e) {
                LOG.error("Cannot determine CS resource id via func otdsintegration.getresourceid", e);
            }
        }

        return ret;
    }

    private boolean isEmpty(String s) {
        return s == null || s.trim().length() == 0;
    }

}
