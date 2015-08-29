package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.ContentServiceConstants;
import com.opentext.ecm.otsync.http.HTTPRequestManager;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.message.SynchronousMessageListener;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import com.opentext.ecm.otsync.ws.server.ClientType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static com.opentext.ecm.otsync.ContentServiceConstants.MAX_ALLOWED_STORED_RESPONSES;

// TODO FIXME we really need to ask clients to auth via OTAG not this endpoint,
// TODO FIXME the Tempo desktop wipe probably needs to be reimplemented
public class AuthMessageListener implements SynchronousMessageListener {

    private MessageConverter _messageConverter;
    private HTTPRequestManager _serverConnection;
    public static Log log = LogFactory.getLog(AuthMessageListener.class);

    public AuthMessageListener(MessageConverter messageConverter, HTTPRequestManager serverConnection) {
        _messageConverter = messageConverter;
        _serverConnection = serverConnection;
    }

    public Map<String, Object> onMessage(Map<String, Object> message) throws IOException {
//		EntityManager manager = Setting.emf.createEntityManager();
        boolean isRest = false;

        Map<String, String> params = new HashMap<>();
        String password;

        // remove header values from the payload while it is being JSONified
        RequestHeader headers = (RequestHeader) message.get(RequestHeader.REQUEST_HEADER_KEY);
        message.remove(RequestHeader.REQUEST_HEADER_KEY);

        // Put characters around the password incase it has spaces
        // at the front or end to avoid issue with CS core parse JSON
        // triming passwords.
        password = (String) message.remove(Message.PASSWORD_KEY_NAME);
        if (password != null) {
            password = "<" + password + ">";
            message.put(Message.PASSWORD_KEY_NAME, password);
        }

        // TODO TO MAKE SURE THAT EVEN IF THE CLIENT ISNT AUTHED IT STILL GETS WIPED
        // TODO direct access to our clients is not permitted, expose as a service so deployments can grab client rows???
//		// check whether this client has been set to wipe
        String id = (String) message.get(Message.CLIENT_ID_KEY_NAME);
//		if(id != null){
//			com.opentext.otag.common.tracking.Client clientInfo = manager.find(com.opentext.otag.common.tracking.Client.class, id);
//
//			// the client should be wiped if wipe status is either pending or complete
//			// (in the latter case, it is mistakenly trying to connect again using the old client id)
//			boolean isWipeRequested = (clientInfo != null) && clientInfo.getWipe() != null;
//
//			if(isWipeRequested){
//				String username = clientInfo.getUsername();
//				OTSyncServer.log.info("Wipe request pending for authorizing client " + id + " for user " + username);
//
//				// Get a one-time-only otag token the client can use to validate it's "I have finished wiping" call
//				// we use an empty username because the client will not provide it when it makes the wipe-complete call
//                String token = IdentityProvider.getService().getOneTimeToken("", id, ClientID.WIPE_OPERATION_NAME);
//
//    			Map<String, Object> wipeMessage = new HashMap<String, Object>();
//                wipeMessage.put(Message.AUTH_KEY_VALUE, false);
//                wipeMessage.put(Message.OK_KEY_VALUE, false);
//                wipeMessage.put(Message.WIPE_KEY_VALUE, true);
//                wipeMessage.put(Message.TOKEN_KEY_NAME, token);
//
//                return wipeMessage;
//			}
//		}
//
        // Send the auth request to CS
        params.put("func", "otsync.otsyncrequest");
        params.put("payload", _messageConverter.getSerializer().serialize(message));

        String in = _serverConnection.postData(ServletConfig.getContentServerUrl(), params, headers);

        // Get the payload and info member from the response string
        Map<String, Object> ret = _messageConverter.getDeserializer().deserialize(in);
        @SuppressWarnings("unchecked")
        Map<String, Object> info = (Map<String, Object>) ret.get(Message.INFO_KEY_NAME);
        // for rest-style responses, there is no info (the response itself is takes its place)
        if (info == null) {
            info = ret;
            isRest = true;
        }

        //Get the client properties associated with the currently connected client type
        ClientType currentClient;

        if (message.containsKey(Message.CLIENT_CURRENTVERSION_KEY_VALUE) && !message.containsKey(Message.CLIENT_OS_KEY_NAME)) {
            //Get default Windows client as this is a legacy client making the request
            currentClient = ServletConfig.getClient();
        } else {
            String clientOS = (String) message.get(Message.CLIENT_OS_KEY_NAME);
            String clientOSVersion = (String) message.get(Message.CLIENT_OSVERSION_KEY_NAME);
            String clientBitness = (String) message.get(Message.CLIENT_BITNESS_KEY_NAME);

            currentClient = ServletConfig.getClient(clientOS, clientOSVersion, clientBitness);
        }


        //Get the client version information from the server to be returned to the client
        if (currentClient != null) {
            String language = (String) message.get(Message.CLIENT_LANGUAGE_KEY_NAME);

            ret.put(Message.CLIENT_OS_RET_KEY, currentClient.getOS()); //OS of current client type
            ret.put(Message.CLIENT_CURRENT_RET_KEY, currentClient.getCurrentVersion()); //current downloadable version of client
            ret.put(Message.CLIENT_MIN_RET_KEY, currentClient.getMinVersion()); //minimum allowed version of client
            ret.put(Message.CLIENT_LINK_RET_KEY, currentClient.getLink(language)); //link to current downloadable version
        }

        //Get the legacy client version if no version is reported
        String clientVersion = (String) message.get(Message.CLIENT_VERSION_KEY_NAME);
        if (clientVersion == null) {
            clientVersion = (String) message.get(Message.CLIENT_CURRENTVERSION_KEY_VALUE);
        }

        //Confirm that current reported version meets the minimum requirements
        if (currentClient != null && clientVersion != null) {

            if (!currentClient.isVersionAllowed(clientVersion)) {
                ret.put(Message.AUTH_KEY_RESPONSE, false);
                ret.put(Message.CLIENT_NEEDS_UPGRADE, true);
                return ret;
            }
        }

        if (Boolean.TRUE.equals(info.get(Message.AUTH_KEY_RESPONSE))) {

            // if the client does not yet have an id, we assign a pseudo-random string as
            // its id
            String clientID;
            Object clientIDObj;

            clientIDObj = message.get(Message.CLIENT_ID_KEY_NAME);
            if (clientIDObj != null) {
                clientID = clientIDObj.toString();
            } else {
                UUID uuid = UUID.randomUUID();
                clientID = uuid.toString();
            }


            String user = getUser(isRest, info);
            if (user == null || user.length() == 0) {
                log.error("Authorized user has no known username. Client id is " + clientID);
            }
            int maxStoredResponses = getMaxStoredResponses(message);

            // TODO FIXME no forceAuth in current impl check old one out
            // authorize the user with OTAG and use the otagtoken as the back-channel token and tell the client it has just been authorized
//			String token = IdentityProvider.getService()
//					.forceAuthForUser(
//							user,
//							clientID,
//							(boolean) info.get("isExternal"));

            // track this client connection event
            // TODO needs a Gateway call again here if you want to track a client, just use otag
            //track(user, clientID, message, headers.getOriginalAddr(), manager);

            if (Boolean.TRUE.equals(message.get(Message.REST_API_KEY_NAME))) {
                info.put(Message.CS_BASE_URL_KEY_NAME, ServletConfig.getContentServerBaseUrl());
            } else {
                info.put(Message.CS_BASE_URL_OLD_KEY_NAME, ServletConfig.getContentServerBaseUrl());
            }
            info.put(Message.SYNC_RECOMMENDED_KEY_NAME, false);

            ret.put(Message.CLIENT_ID_KEY_NAME, clientID);
            // TODO this is the OneTimeToken issued as part of a wipe, this service needs to implement its
            // TODO own ideas around wipe if it wants to fulfil desktop client wiping
            //ret.put(Message.TOKEN_KEY_NAME, token);
            ret.put(Message.MAX_STORED_RESPONSES_KEY_NAME, maxStoredResponses);
            ret.put("isOTAG", true);

            return ret;

        } else {
            ret.put(Message.AUTH_KEY_RESPONSE, false);
            return ret;
        }

        // if an IOException is thrown during the above operations, the message service will catch it
        // and return an HTTP error to the client indicating that the message could not be forwarded
    }


//    private void track(String user, String id, Map<String, Object> data, String ip, EntityManager manager) {
//
//		manager.getTransaction().begin();
//
//    	com.opentext.otag.common.tracking.Client client = manager.find(com.opentext.otag.common.tracking.Client.class, id);
//
//		Timestamp now = new Timestamp(System.currentTimeMillis());
//
//		if(client == null){
//			client = new com.opentext.otag.common.tracking.Client(id);
//			client.setFirstConnect(now);
//		}
//
//		String userID = (String)data.get(Message.USER_ID_KEY_RESPONSE);
//		String app = "Tempo";
//		String type = (String)data.get(Message.CLIENT_TYPE_KEY_NAME);
//		String os = (String)data.get(Message.CLIENT_OS_KEY_NAME);
//		String version = (String)data.get(Message.CLIENT_VERSION_KEY_NAME);
//		String bitness = (String)data.get(Message.CLIENT_BITNESS_KEY_NAME);
//		String deviceID = (String)data.get(Message.CLIENT_DEVICE_ID_KEY_NAME);
//		String location = (String)data.get(Message.CLIENT_LOCATION_KEY_NAME);
//		String language = (String)data.get(Message.CLIENT_LANGUAGE_KEY_NAME);
//		String osVersion = (String)data.get(Message.CLIENT_OSVERSION_KEY_NAME);
//		String cloudPushKey = (String)data.get(Message.CLIENT_CLOUD_PUSH_KEY_NAME);
//
//		// don't track legacy clients that don't declare a type
//		if(type == null) return;
//
//		if(Setting.getBoolean(com.opentext.otag.common.tracking.Client.CLIENT_TRACKING_ENABLED)){
//			client.setUsername(user);
//			if(userID != null) client.setUserID(userID);
//			if(app != null) client.setApp(app);
//			if(type != null) client.setType(type);
//			if(os != null) client.setOs(os);
//			if(version != null) client.setVersion(version);
//			if(bitness != null) client.setBitness(bitness);
//			if(deviceID != null) client.setDeviceID(deviceID);
//			if(location != null) client.setLocation(location);
//			if(language != null) client.setLanguage(language);
//			if(osVersion != null) client.setOsVersion(osVersion);
//			if(ip != null) client.setIp(ip);
//			if(cloudPushKey != null) client.setCloudPushKey(cloudPushKey);
//		}
//		client.setLastConnect(now);
//
//		manager.merge(client);
//
//		manager.getTransaction().commit();
//
//	}

    private String getUser(boolean isRest, Map<String, Object> info) {
        if (isRest) {
            return (String) info.get(Message.REST_USERNAME_KEYNAME);
        } else {
            return (String) info.get(Message.USERNAME_KEY_NAME);
        }
    }

    public int getMaxStoredResponses(Map<String, Object> message) {

        int maxStoredResponses = ContentServiceConstants.DEFAULT_STORED_RESPONSES;

        // if the client passed in a request for a certain number of stored responses,
        // honour it if it is well-formed, but cap it at the configured maximum
        if (message.containsKey(Message.MAX_STORED_RESPONSES_KEY_NAME)) {
            try {
                maxStoredResponses = Integer.parseInt(message.get(Message.MAX_STORED_RESPONSES_KEY_NAME).toString());

                if (MAX_ALLOWED_STORED_RESPONSES < maxStoredResponses) {
                    maxStoredResponses = MAX_ALLOWED_STORED_RESPONSES;
                }

            } catch (NumberFormatException e) {
                log.warn("Client sent non-integer for max stored responses", e);
                // continue using the default value
            }
        }
        return maxStoredResponses;
    }
}
