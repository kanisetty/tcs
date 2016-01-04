package com.opentext.tempo.notifications.api.auth;

import com.opentext.otag.api.HttpClient;
import com.opentext.otag.api.Setting;
import com.opentext.otag.common.notifications.Provider;
import com.opentext.otag.rest.util.ForwardHeaders;
import com.opentext.tempo.notifications.persistence.PersistenceHelper;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectReader;
import org.codehaus.jackson.type.TypeReference;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CSExternalUserAPI implements ExternalUserAPI {

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

    private final HttpClient http;
    private final ObjectMapper mapper = new ObjectMapper();
    private final ObjectReader reader = mapper.reader(new TypeReference<Map<String, Object>>(){});

    public CSExternalUserAPI(HttpClient client) {
        http = client;
    }

    public ExternalUserAPIResult inviteeValidated(String email, String password, String firstName,
                                                  String lastName, ForwardHeaders headers){
        Map<String, Object> info = new HashMap<String, Object>();

        info.put(USERNAME_KEY_NAME, email);
        info.put(PASSWORD_KEY_NAME, password);
        info.put(FIRST_NAME_KEY, firstName);
        info.put(LAST_NAME_KEY, lastName);

        return sendInfo(info, ACTIVATION_SUBTYPE, headers);
    }

    public ExternalUserAPIResult inviteeValidated(String email, String existingEmail,
                                                  String existingPassword, ForwardHeaders headers){
        Map<String, Object> info = new HashMap<String, Object>();

        info.put(REJECTED_EMAIL_KEY, email);
        info.put(USERNAME_KEY_NAME, existingEmail);
        info.put(PASSWORD_KEY_NAME, existingPassword);

        return sendInfo(info, TRANSFER_SHARE_SUBTYPE, headers);
    }

    public ExternalUserAPIResult userExist(String username, ForwardHeaders headers) {
        Map<String, Object> info = new HashMap<String, Object>();

        info.put(USERNAME_KEY_NAME, username);

        return sendInfo(info, GET_EXTERNAL_USER_INFO_SUBTYPE, headers);
    }

    public ExternalUserAPIResult sendPasswordUpdate(String email, String oldPwd,
                                                    String newPwd, ForwardHeaders headers){
        Map<String, Object> info = new HashMap<String, Object>();

        info.put(USERNAME_KEY_NAME, email);
        info.put(PASSWORD_KEY_NAME, oldPwd);
        info.put(NEW_PASSWORD_KEY, newPwd);

        return sendInfo(info, PASSWORD_UPDATE_SUBTYPE, headers);
    }

    private ExternalUserAPIResult sendInfo(Map<String, Object> info, String subtype, ForwardHeaders headers) {
        try {
            Provider provider = PersistenceHelper.getGatewayEm().
                    find(Provider.class, Provider.CONTENTSERVER_NAME);
            if (provider == null) {
                throw new IllegalStateException("ContentServer provider not defined; " +
                        "can't perform external user functions.");
            }

            Map<String, Object> payload = new HashMap<String, Object>();

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
        }
    }

    private Map<String, Object> send(Map<String, Object> payload, ForwardHeaders headers) throws IOException{
        List<NameValuePair> postParams = new ArrayList<NameValuePair>(2);

        String json = mapper.writeValueAsString(payload);
        postParams.add(new BasicNameValuePair(FUNCTION_PARAMETER_NAME, EXTERNAL_USER_API_REQUESTHANDLER));
        postParams.add(new BasicNameValuePair(PAYLOAD_KEY_NAME, json));

        String jsonResult = http.post(Setting.get(Setting.CONTENTSERVER_URL), postParams, headers);

        return reader.readValue(jsonResult);
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
        Map<String, Object> info = new HashMap<String, Object>();

        Object infoObj = message.get(INFO_KEY_NAME);

        if (infoObj != null && infoObj instanceof Map<?, ?>){
            info = (Map<String, Object>)infoObj;
        }

        return info;
    }

}

