package com.opentext.tempo.external.invites.invitee.managment;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.api.HttpClient;
import com.opentext.otsync.otag.EIMConnectorHelper;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.tempo.external.invites.appworks.di.ServiceIndex;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.opentext.otsync.api.CSRequestHelper.makeRequest;

public class CSExternalUserAPI implements ExternalUserAPI {

    private static final Log LOG = LogFactory.getLog(CSExternalUserAPI.class);

    private static final String EXTERNAL_USER_API_REQUESTHANDLER = "otsync.UserAdminRequest";
    private static final String FUNCTION_PARAMETER_NAME = "func";
    private final static String PAYLOAD_KEY_NAME = "payload";
    private final static String USERNAME_KEY_NAME = "username";
    private final static String PASSWORD_KEY_NAME = "password";
    private static final String FIRST_NAME_KEY = "firstName";
    private static final String LAST_NAME_KEY = "lastName";
    private static final String ACTIVATION_SUBTYPE = "activateUser";
    private static final String TRANSFER_SHARE_SUBTYPE = "mergeUsers";
    private static final String PASSWORD_UPDATE_SUBTYPE = "updatePassword";
    private static final String REJECTED_EMAIL_KEY = "rejectedEmail";
    private static final String GET_EXTERNAL_USER_INFO_SUBTYPE ="getUserInfo";
    private static final String NEW_PASSWORD_KEY = "newPassword";
    private final static String TYPE_KEY_NAME = "type";
    private final static String INFO_KEY_NAME = "info";
    private static final Object EXTERNAL_USER_MSG_TYPE = "externalUserAPI";
    private final static String SUBTYPE_KEY_NAME = "subtype";
    private final static String NOTIFY_CHANNEL_KEY_NAME = "key";
    private final static String OK_KEY_NAME = "ok";
    private final static String ERROR_MSG_KEY_NAME = "errMsg";

    private final CloseableHttpClient httpClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private final ObjectReader reader = mapper.readerFor(new TypeReference<Map<String, Object>>(){});

    public CSExternalUserAPI(CloseableHttpClient client) {
        httpClient = client;
    }

    public ExternalUserAPIResult inviteeValidated(String email, String password, String firstName,
                                                  String lastName, CSForwardHeaders headers){
        Map<String, Object> info = new HashMap<>();

        info.put(USERNAME_KEY_NAME, email);
        info.put(PASSWORD_KEY_NAME, password);
        info.put(FIRST_NAME_KEY, firstName);
        info.put(LAST_NAME_KEY, lastName);

        return sendInfo(info, ACTIVATION_SUBTYPE, headers);
    }

    public ExternalUserAPIResult inviteeValidated(String email, String existingEmail,
                                                  String existingPassword, CSForwardHeaders headers){
        Map<String, Object> info = new HashMap<>();

        info.put(REJECTED_EMAIL_KEY, email);
        info.put(USERNAME_KEY_NAME, existingEmail);
        info.put(PASSWORD_KEY_NAME, existingPassword);

        return sendInfo(info, TRANSFER_SHARE_SUBTYPE, headers);
    }

    public ExternalUserAPIResult userExist(String username, CSForwardHeaders headers) {
        Map<String, Object> info = new HashMap<>();

        info.put(USERNAME_KEY_NAME, username);

        return sendInfo(info, GET_EXTERNAL_USER_INFO_SUBTYPE, headers);
    }

    public ExternalUserAPIResult sendPasswordUpdate(String email, String oldPwd,
                                                    String newPwd, CSForwardHeaders headers){
        Map<String, Object> info = new HashMap<>();

        info.put(USERNAME_KEY_NAME, email);
        info.put(PASSWORD_KEY_NAME, oldPwd);
        info.put(NEW_PASSWORD_KEY, newPwd);

        return sendInfo(info, PASSWORD_UPDATE_SUBTYPE, headers);
    }

    private ExternalUserAPIResult sendInfo(Map<String, Object> info, String subtype, CSForwardHeaders headers) {
        try {
            TrustedProviderClient client = new TrustedProviderClient();
            TrustedProvider provider = client.getOrCreate(EIMConnectorHelper.CS_CONNECTOR_NAME); // TODO REVISIT, WE NEED A COMMON TRUSTED SERVER NAME
            if (provider == null) {
                throw new IllegalStateException("ContentServer provider not defined; " +
                        "can't perform external user functions.");
            }

            Map<String, Object> payload = new HashMap<>();

            payload.put(INFO_KEY_NAME, info);
            payload.put(TYPE_KEY_NAME, EXTERNAL_USER_MSG_TYPE);
            payload.put(SUBTYPE_KEY_NAME, subtype);
            payload.put(NOTIFY_CHANNEL_KEY_NAME, provider.getKey());

            Map<String, Object> result = send(payload, headers);
            Map<String, Object> resultInfo = getInfo(result);

            if (Boolean.TRUE.equals(resultInfo.get(OK_KEY_NAME))){
                return new ExternalUserAPIResult();
            } else {
                String errMsg = getFieldAsString(resultInfo, ERROR_MSG_KEY_NAME);
                return new ExternalUserAPIResult(
                        ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
                        URLDecoder.decode(errMsg, HttpClient.ENCODING));
            }

        } catch (IOException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.IOERROR, null);
        } catch (APIException e) {
            LOG.error("Gateway API call failed - " + e.getCallInfo());
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.IOERROR, null);
        }
    }

    private Map<String, Object> send(Map<String, Object> payload, CSForwardHeaders headers) throws IOException{
        List<NameValuePair> postParams = new ArrayList<>(2);

        String json = mapper.writeValueAsString(payload);
        postParams.add(new BasicNameValuePair(FUNCTION_PARAMETER_NAME, EXTERNAL_USER_API_REQUESTHANDLER));
        postParams.add(new BasicNameValuePair(PAYLOAD_KEY_NAME, json));

        HttpPost request = new HttpPost(ServiceIndex.csUrl());
        request.setEntity(new UrlEncodedFormEntity(postParams));
        headers.addTo(request);
        try (CloseableHttpResponse response = makeRequest(httpClient, request, headers)) {
            String jsonResult = EntityUtils.toString(response.getEntity());
            return reader.readValue(jsonResult);
        }
    }

    private static String getFieldAsString(Map<String, Object> message, String field){
        Object rawField = message.get(field);
        if (rawField != null && rawField instanceof String){
            return (String) rawField;

        } else {
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> getInfo(Map<String, Object> message){
        Map<String, Object> info = new HashMap<>();

        Object infoObj = message.get(INFO_KEY_NAME);

        if (infoObj != null && infoObj instanceof Map<?, ?>){
            info = (Map<String, Object>)infoObj;
        }

        return info;
    }

}

