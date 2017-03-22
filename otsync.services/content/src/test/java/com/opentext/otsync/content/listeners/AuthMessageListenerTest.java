package com.opentext.otsync.content.listeners;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otsync.content.otag.GatewayUrlSettingService;
import com.opentext.otsync.content.ws.message.MessageConverter;
import com.opentext.otsync.content.ws.server.ClientTypeSet;
import org.junit.Before;
import org.junit.Test;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import static org.fest.assertions.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

public class AuthMessageListenerTest {

    private ObjectMapper objectMapper = new ObjectMapper();

    private AuthMessageListener underTest;

    @Before
    public void setup() {
        underTest = new AuthMessageListener(
                mock(MessageConverter.class),
                mock(ClientTypeSet.class),
                mock(GatewayUrlSettingService.class));
    }

    @Test
    public void testReplaceUsernameInMessage() throws Exception {
        Map awAuthResponse = getAwResponse();
        Map message = new HashMap<String, Object>(){{
            put(AuthMessageListener.USERNAME, "username");
        }};

        callReplaceUsernameInMessage(message, awAuthResponse);

        // the user name from the JSON structure we loaded
        assertThat(message.get(AuthMessageListener.USERNAME)).isEqualTo("otag");
    }

    @Test
    public void testReplaceUsernameInMessage_noConnectorFound() throws Exception {
        // we use the JSON response without the connector this time
        Map awAuthResponse = objectMapper.readValue(
                TEST_RESPONSE_W_OUT_CONNECTOR, new TypeReference<Map<String, Object>>() {});
        Map message = new HashMap<String, Object>(){{
            put(AuthMessageListener.USERNAME, "username");
        }};

        callReplaceUsernameInMessage(message, awAuthResponse);

        // the user name from the JSON structure we loaded
        assertThat(message.get(AuthMessageListener.USERNAME)).isEqualTo("username");
    }

    @Test
    public void testReplaceUsernameInMessage_noUserInMessage() throws Exception {
        Map awAuthResponse = getAwResponse();
        Map message = new HashMap<String, Object>();
        callReplaceUsernameInMessage(message, awAuthResponse);
        // make sure we didn't try to add a username if it wasn't in the original message
        assertThat(message.containsKey(AuthMessageListener.USERNAME)).isFalse();
    }

    @Test
    public void testReplaceUsernameInMessage_nullMessage() throws Exception {
        Map awAuthResponse = getAwResponse();
        callReplaceUsernameInMessage(null, awAuthResponse);
    }

    @Test
    public void testReplaceUsernameInMessage_nullAwAuthResponse() throws Exception {
        HashMap message = new HashMap();
        callReplaceUsernameInMessage(message, null);
        assertThat(message.containsKey(AuthMessageListener.USERNAME)).isFalse();
    }

    private Map getAwResponse() throws java.io.IOException {
        return objectMapper.readValue(TEST_RESPONSE, new TypeReference<Map<String, Object>>() {});
    }

    private void callReplaceUsernameInMessage(Map message, Map awAuthResponse)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Method replaceUsernameInMessageMethod = AuthMessageListener.class
                .getDeclaredMethod("replaceUsernameInMessage", Map.class, Map.class);
        replaceUsernameInMessageMethod.setAccessible(true);
        replaceUsernameInMessageMethod.invoke(underTest, message, awAuthResponse);
    }

    private static final String TEST_RESPONSE = "{\n" +
            "   \"isOTAG\":true,\n" +
            "   \"admin\":true,\n" +
            "   \"id\":\"adb17f63-37da-43bd-97a6-b74aebc734d4\",\n" +
            "   \"otagtoken\":\"xxxxx-2b4b8568-fae3-4e06-8786-66aa465a6e2e\",\n" +
            "   \"otdsticket\":\"*OTDSSSO*lnc45YHr2ce_oMAIKEsQD9ZBDZjMuBtPcsvTYFFw2tMGriWKViK03c8OS7MAAA*\",\n" +
            "   \"email\":null,\n" +
            "   \"userName\":\"otag@otag\",\n" +
            "   \"userID\":\"otag@otag\",\n" +
            "   \"firstName\":null,\n" +
            "   \"lastName\":null,\n" +
            "   \"addtl\":{\n" +
            "      \"otsync-connector\":{\n" +
            "         \"otcsticket\":\"sn%3SDDNwQvy4Smmwvkjy54Gl5XjObyFZlG0HaqeXYKZzB9E%2BGhUl%2BTm1SpDBuD\",\n" +
            "         \"csUsername\":\"otag\",\n" +
            "         \"csUserId\":\"3862\"\n" +
            "      }\n" +
            "   },\n" +
            "   \"expires\":\"1490203131043\"\n" +
            "}";

    private static final String TEST_RESPONSE_W_OUT_CONNECTOR = "{\n" +
            "   \"isOTAG\":true,\n" +
            "   \"admin\":true,\n" +
            "   \"id\":\"adb17f63-37da-43bd-97a6-b74aebc734d4\",\n" +
            "   \"otagtoken\":\"xxxxx-2b4b8568-fae3-4e06-8786-66aa465a6e2e\",\n" +
            "   \"otdsticket\":\"*OTDSSSO*lnc45YHr2ce_oMAIKEsQD9ZBDZjMuBtPcsvTYFFw2tMGriWKViK03c8OS7MAAA*\",\n" +
            "   \"email\":null,\n" +
            "   \"userName\":\"otag@otag\",\n" +
            "   \"userID\":\"otag@otag\",\n" +
            "   \"firstName\":null,\n" +
            "   \"lastName\":null,\n" +
            "   \"expires\":\"1490203131043\"\n" +
            "}";

}