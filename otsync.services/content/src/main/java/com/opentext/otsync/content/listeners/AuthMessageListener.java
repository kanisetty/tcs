package com.opentext.otsync.content.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.message.SynchronousMessageListener;
import com.opentext.otsync.content.otag.GatewayUrlSettingService;
import com.opentext.otsync.content.util.ReturnHeaders;
import com.opentext.otsync.content.ws.ServletConfig;
import com.opentext.otsync.content.ws.message.MessageConverter;
import com.opentext.otsync.content.ws.server.ClientTypeSet;
import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.opentext.otsync.api.CSRequestHelper.makeRequest;

// TODO FIXME this legacy endpoint should be deprecated once AppWorks implements all required features
// and clients can be updated
public class AuthMessageListener implements SynchronousMessageListener {

    private MessageConverter _messageConverter;
    private static Log log = LogFactory.getLog(AuthMessageListener.class);
    private ClientTypeSet _clientSet;
    private GatewayUrlSettingService gatewayUrlSettingService;

    public AuthMessageListener(MessageConverter messageConverter,
                               GatewayUrlSettingService gatewayUrlSettingService) {
        _messageConverter = messageConverter;

        _clientSet = new ClientTypeSet();
        this.gatewayUrlSettingService = gatewayUrlSettingService;
    }

    /**
     * Authenticate the user based on the incoming auth parameters
     * if an IOException is thrown, the message service will catch it
     * and return an HTTP error to the client indicating that the message could not be forwarded
     *
     * @param message - incoming request map with legacy FrontChannel format
     * @return - Map containing all fields to be returned to the requesting client
     * @throws IOException
     */
    public Map<String, Object> onMessage(Map<String, Object> message) throws IOException {
        HttpServletRequest request = (HttpServletRequest) message.remove(ContentServiceConstants.INCOMING_REQUEST_KEY);
        ReturnHeaders returnHeaders = new ReturnHeaders();

        Map<String, Object> combinedResult = generateDefaultResponse();

        Map<String, Object> awAuthResult = doAppWorksAuth(message, request, returnHeaders);
        combinedResult.putAll(awAuthResult);


        if(message.containsKey("username")){
            log.debug("Username key found" );
            // We need to overwrite the username and password in the message passed to the Content Server auth

            // First we check that the username isn't empty or invalid
            log.debug("Replacing username based on OTSYNC Connector creds....");
            if (awAuthResult.containsKey("addtl") && (awAuthResult.get("addtl") != null)){

                try {
                    Map<String, Object> otsyncParent = (Map<String, Object>) awAuthResult.get("addtl");

                    if(otsyncParent.containsKey("otsync-connector")){
                        log.trace("OTSYNC Connector key found....");
                        Map<String, Object> otsyncKeys = (Map<String, Object>) otsyncParent.get("otsync-connector");

                        String otsyncUsername = (String) otsyncKeys.get("csUsername");
                        log.trace("OTSYNC Connector Username is: " + otsyncUsername);
                        if (otsyncUsername != null && !otsyncUsername.isEmpty()){
                            log.trace("Username replacement in progress");
                            log.trace("Username from message object is:" + message.get("username"));
                            log.trace("Removing Key: username");
                            message.remove("username");
                            message.put("username", otsyncUsername);
                            log.trace("Username from message object is:" + message.get("username"));

                        } else{
                            log.error("Username replacement failed - OTSYNC Username is blank" );
                        }

                    }


                } catch (Exception e) {
                    e.printStackTrace();
                }


            }

        }

        Map<String, Object> csAuthResult = doContentServerAuth(message, request, returnHeaders);
        combinedResult.putAll(csAuthResult);

        Map<String, Object> versionData = _clientSet.doClientVersionCheck(message);
        combinedResult.putAll(versionData);

        combinedResult.put(ReturnHeaders.MAP_KEY, returnHeaders);
        return combinedResult;
    }

    /**
     * Take the incoming request map and pull out the values required for AppWorks Auth
     *
     * @param message - Incoming request map
     * @return - JSON string containing the expected AppWorks Auth string
     */
    private String buildAWAuthRequestString(Map<String, Object> message) {
        Map<String, Object> params = new HashMap<>();
        params.put("userName", message.getOrDefault(Message.USERNAME_KEY_NAME, ""));
        params.put("password", message.getOrDefault(Message.PASSWORD_KEY_NAME, ""));

        Map<String, Object> clientData = new HashMap<>();
        params.put("clientData", clientData);

        String clientID = (String) message.getOrDefault(Message.CLIENT_ID_KEY_NAME, "");
        if (!"".equalsIgnoreCase(clientID) && !"null".equalsIgnoreCase(clientID)) {
            clientData.put("clientId", clientID);
        }

        Map<String, Object> clientInfo = new HashMap<>();
        clientData.put("clientInfo", clientInfo);

        clientInfo.put("type", message.getOrDefault(Message.CLIENT_TYPE_KEY_NAME, ""));
        clientInfo.put("version", message.getOrDefault(Message.CLIENT_CURRENTVERSION_KEY_VALUE, ""));
        clientInfo.put("os", message.getOrDefault(Message.CLIENT_OS_KEY_NAME, ""));
        clientInfo.put("osVersion", message.getOrDefault(Message.CLIENT_OSVERSION_KEY_NAME, ""));
        clientInfo.put("bitness", message.getOrDefault(Message.CLIENT_BITNESS_KEY_NAME, ""));

        String runtimeName = "Tempo Box " + message.getOrDefault(Message.CLIENT_TYPE_KEY_NAME, "");
        clientInfo.put("runtime", runtimeName);

        Map<String, Object> deviceInfo = new HashMap<>();
        clientData.put("deviceInfo", deviceInfo);

        String modelName = "" + message.getOrDefault(Message.CLIENT_OS_KEY_NAME, "") + " " +
                message.getOrDefault(Message.CLIENT_OSVERSION_KEY_NAME, "");
        deviceInfo.put("model", modelName);

        ObjectMapper mapper = new ObjectMapper();
        String requestJSON = null;

        try {
            requestJSON = mapper.writeValueAsString(params);
        } catch (JsonProcessingException e) {
            log.error(e);
        }

        return requestJSON;
    }

    /**
     * Authenticate with AppWorks to get authentication tokens required for AppWorks services
     *
     * @param message - Map containing the incoming request body
     * @return - Map containing required tokens and info mapped to the legacy API response format
     * @throws IOException
     */
    private Map<String, Object> doAppWorksAuth(Map<String, Object> message,
                                               HttpServletRequest incomingRequest,
                                               ReturnHeaders returnHeaders) throws IOException {
        Map<String, Object> result = new HashMap<>();
        String requestJSON = buildAWAuthRequestString(message);
        CSForwardHeaders headers = new CSForwardHeaders(incomingRequest);

        HttpResponse response;

        HttpClient httpClient = new DefaultHttpClient();
        try {
            String requestURL = gatewayUrlSettingService.getGatewayUrl() + "/v3/admin/auth";
            HttpPost request = new HttpPost(requestURL);

            headers.addTo(request);
            request.addHeader("content-type", "application/json");
            request.setEntity(new StringEntity(requestJSON));
            response = httpClient.execute(request);
        } catch (Exception e) {
            log.error(e);
            throw e;
        }

        if (response.getStatusLine().getStatusCode() == 200) {
            result.put("auth", Boolean.TRUE);
        } else {
            // If auth was unsuccessful, return the expected legacy error data structure
            result.put("info", generateErrorInfo(
                    response.getStatusLine().getReasonPhrase(),
                    response.getStatusLine().getStatusCode()));
            return result;
        }

        String responseString;
        Map<String, Object> workingMap;
        try {
            responseString = EntityUtils.toString(response.getEntity());
            workingMap = _messageConverter.getDeserializer().deserialize(responseString);
        } catch (IOException e) {
            log.error(e);
            throw e;
        }


        result.putAll(workingMap);

        //Map AW response fields to expected API response
        result.put("token", workingMap.getOrDefault("otagtoken", ""));
        result.put("isOTAG", workingMap.getOrDefault("isOTAG", false));
        result.put("clientID", workingMap.getOrDefault("id", ""));

        if (workingMap.get("wipe") != null) {
            result.put("wipe", workingMap.get("wipe"));
        }

        returnHeaders.extractHeaders(response);

        return result;
    }

    /**
     * Authenticate with Content Service module to get authentication token required for Content Server calls
     * Also returns system preferences and user info required by the legacy desktop and web clients
     *
     * @param message - Map containing the incoming request body
     * @return - Map containing required tokens and info mapped to the legacy API response format
     * @throws IOException if the auth request fails
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> doContentServerAuth(Map<String, Object> message,
                                                    HttpServletRequest incoming,
                                                    ReturnHeaders returnHeaders) throws IOException {
        Map<String, Object> result = new HashMap<>();
        CSForwardHeaders headers = new CSForwardHeaders(incoming);
        ArrayList<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("func", "otsync.otsyncrequest"));

        try {
            params.add(new BasicNameValuePair("payload", _messageConverter.getSerializer().serialize(message)));
        } catch (IOException e) {
            log.error(e);
            return new HashMap<>();
        }

        HttpPost request = new HttpPost(ServletConfig.getContentServerUrl());
        headers.addTo(request);
        request.setEntity(new UrlEncodedFormEntity(params));

        String responseString;
        Map<String, Object> workingMap;
        CloseableHttpClient httpClient = HttpClientService.getService().getHttpClient();
        try (CloseableHttpResponse response = makeRequest(httpClient, request, headers)) {
            try {
                responseString = EntityUtils.toString(response.getEntity());
                workingMap = _messageConverter.getDeserializer().deserialize(responseString);
            } catch (IOException e) {
                log.error(e);
                throw e;
            }
            // Insert extra required info data
            Map<String, Object> info = (Map<String, Object>) workingMap.get("info");
            if (info != null) {
                info.put(Message.SYNC_RECOMMENDED_KEY_NAME, false);
                if (Boolean.FALSE.equals(info.get("auth"))) {
                    result.put("auth", Boolean.FALSE);
                }
            }
            // Map CS response fields to current expected API response
            result.put("APIVersion", workingMap.getOrDefault("APIVersion", 4));
            result.put(ContentServiceConstants.CS_AUTH_TOKEN,
                    workingMap.getOrDefault(ContentServiceConstants.CS_AUTH_TOKEN, ""));
            result.put("info", workingMap.get("info"));
            result.put("serverDate", workingMap.get("serverDate"));
            result.put("subtype", workingMap.getOrDefault("subtype", "auth"));
            result.put("type", workingMap.getOrDefault("type", "auth"));

            returnHeaders.extractHeaders(response);
        }

        return result;
    }

    /**
     * Legacy clients expect the nested info structure from Content Server whether the auth/version check succeed or not
     * If authentication is blocked prior to hitting Content Server, fake this structure
     *
     * @param errMsg     - English description of the error for logging
     * @param statusCode - HTTP status code
     * @return - Info map with info on the error condition
     */
    private Map<String, Object> generateErrorInfo(String errMsg, int statusCode) {
        Map<String, Object> info = new HashMap<>();
        info.put("auth", Boolean.FALSE);
        info.put("errMsg", errMsg);
        info.put("statusCode", statusCode);
        info.put("exceptionCode", "badlogin");
        info.put("ok", Boolean.FALSE);

        return info;
    }

    /**
     * Legacy clients expect default fields to be present and can crash if missing
     * Add these fields with defaults to the response prior to any validation.
     *
     * @return - map containing default fields and values
     */
    private Map<String, Object> generateDefaultResponse() {
        Map<String, Object> result = new HashMap<>();

        result.put("APIVersion", 4);
        result.put("clientID", null);
        result.put("info", generateErrorInfo("Unknown request error", 400));
        result.put("serverDate", null);
        result.put("subtype", "auth");
        result.put("type", "auth");
        result.put("clientOS", null);
        result.put("clientCurVersion", null);
        result.put("clientMinVersion", null);
        result.put("clientLink", null);
        result.put("auth", false);
        result.put("clientNeedsUpgrade", false);
        result.put(Message.MAX_STORED_RESPONSES_KEY_NAME, ContentServiceConstants.DEFAULT_STORED_RESPONSES);
        result.put("isOTAG", false);

        return result;
    }
}