
package com.opentext.ecm.otsync.message;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.listeners.SynchronousMessageSwitch;
import com.opentext.ecm.otsync.ws.server.ResponseHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class Message extends SuspendedAction {

	public final static String TYPE_KEY_NAME = "type";
	public final static String USERNAME_KEY_NAME = "username";
	public static final String REST_USERNAME_KEYNAME = "userName";
	public final static String PASSWORD_KEY_NAME = "password";
	public final static String CLIENT_ID_KEY_NAME = "clientID";
	public final static String PARENT_ID_KEY_NAME = "parentID";
	public final static String PAYLOAD_KEY_NAME = "payload";
	public final static String VERSION_FILE_KEY_NAME = "versionFile";
	public static final String PHOTO_FILE_KEY_NAME = "photo";
	public final static String LAST_PART_KEY_NAME = "lastpart";
	public final static String NAME_KEY_NAME = "name";
	public final static String SUBTYPE_KEY_NAME = "subtype";
	public final static String NODE_ID_KEY_NAME = "nodeID";
	public final static String REMOTE_ADDRESS_KEY_NAME = "remoteAddress";
	public final static String ID_KEY_NAME = "id";
	public final static String TRANSACTIONID_KEY_NAME = "transactionID";
	public final static String IN_PROGRESS_KEY_NAME = "pending";
	public final static String MAX_STORED_RESPONSES_KEY_NAME = "storeResponses";
	public final static String ATTRIBUTES_KEY_NAME = "attributes";
	public final static String FOLDER_ID_KEY_NAME = "folderID";
	public final static String ASSIGNED_TO_KEY_NAME = "assignedTo";
	public final static String DUE_DATE_KEY_NAME = "dueDate";
	public final static String STATUS_KEY_NAME = "status";
	public final static String TASK_ID_KEY_NAME = "taskID";

	public final static String AUTH_KEY_VALUE = "auth";
	public final static String OK_KEY_VALUE = "ok";
	public final static String NOTIFY_KEY_VALUE = "request";
	public final static String PULSE_KEY_VALUE = "pulse";
	public final static String CONTENT_KEY_VALUE = "contentRequest";
	public final static String CHUNKED_CONTENT_KEY_VALUE = "chunkedContentRequest";
	public final static String SERVER_CHECK_KEY_VALUE = "serverCheck";
	
	public final static String CONTENT_SUBTYPE_DOWNLOAD = "DownloadRequest";
	public final static String CONTENT_SUBTYPE_UPLOAD = "UploadRequest";

	public static final String PULSE_SUBTYPE_GET_COMMENTS = "GetComments";
	public static final String PULSE_SUBTYPE_ADD_COMMENT = "AddComment";
	public static final String PULSE_STATUS_KEY_NAME = "status";
	
	public static final String SYNC_RECOMMENDED_KEY_NAME = "doSync";

	public final static String AUTH_KEY_RESPONSE = "auth";
	public final static String USER_ID_KEY_RESPONSE = "userID";
	public final static String ERROR_KEY_RESPONSE = "errMsg";

	public final static String INFO_KEY_NAME = "info";
	public final static String PULSE_KEY_RESPONSE = INFO_KEY_NAME;
	public final static String CS_BASE_URL_KEY_NAME = "csBaseURL";
	public final static String CS_BASE_URL_OLD_KEY_NAME = "csbaseurl";

	public static final String NEW_PASSWORD_KEY = "newPassword";
	
	public static final String GET_SYNC_TREE_VALUE = "getsynctree";
	public static final String GET_OBJECT_INFO_VALUE = "getobjectinfo";
	public static final String NODE_IDS_KEY_NAME = "nodeIDs";
	public static final String FIELDS_KEY_NAME = "fields";
	public static final String GET_SHARED_BY_USER_VALUE = "getsharedbyuser";
	public static final String GET_SHARE_INFO_VALUE = "getsharesforobject";
	public static final String SHARE_VALUE = "share";
	public static final String USERLOGIN_KEY_NAME = "userLogin";
	public static final String SHARE_TYPE_KEY_NAME = "shareType";
	public static final String VIRTUAL_KEY_NAME = "virtual";
	public static final String USER_LIST_KEY_NAME = "userList";
	public static final String CHANGE_SHARE_VALUE = "changesharetype";
	public static final String UNSHARE_VALUE = "unshare";
	public static final String UNSHARE_ALL_VALUE = "unshareall";
	public static final String COUNT_ONLY_VALUE = "countOnly";
	public static final String GET_SHARE_LIST_VALUE = "getsharelist";
	public static final String GET_SHARE_COUNT_VALUE = "getsharelistcount";
	public static final String COPY_FROM_KEY_NAME = "copyFrom";
	public static final String RECURSIVE_KEY_NAME = "recursive";
	public static final String VERSION_KEY_NAME = "version";
	public static final String OLD_PASSWORD_KEY_NAME = "oldPassword";
	public static final String FILTER_KEY_NAME = "filter";
	public static final String ACCEPTED_KEY_NAME = "accepted";
	public static final String REJECTED_KEY_NAME = "rejected";
	public static final String ACCEPT_SHARE_VALUE = "acceptsharerequest";
	public static final String REJECT_SHARE_VALUE = "rejectsharerequest";
	public static final String DELETE_ORIGINAL_KEY_NAME = "deleteOriginal";
	public static final String GET_FOLDER_CONTENTS_VALUE = "getfoldercontents";
	public static final String SEARCH_VALUE = "search";
	public static final String ISTEMPOSEARCH_KEY_NAME = "isTempoSearch";
	public static final String NODE_TYPES_KEY_NAME = "nodeTypes";
	public static final String ISNAMEONLYSEARCH_KEY_NAME = "isNameOnlySearch";
	public static final String IDS_KEY_NAME = "ids";
	public static final String SEARCH_LOCATION_KEY_NAME = "searchLocation";
	public static final String QUERY_KEY_NAME = "query";
	public static final String PUBLISH_TO_FILE_COPY = "pubtofilecopy";
	public static final String PUBLISH_TO_FILE_MOVE = "pubtofilemove";
	public static final String TARGET_KEY_NAME = "target";
	public static final String COPY_NODE_VALUE = "copy";
	public static final String CREATE_FOLDER_VALUE = "createfolder";
	public static final String NEW_NAME_KEY_NAME = "newName";
	public static final String GET_HISTORY_VALUE = "gethistory";
	public static final String RENAME_NODE_VALUE = "rename";
	public static final String MOVE_NODE_VALUE = "move";
	public static final String DELETE_NODE_VALUE = "delete";
	public static final String GET_LOCATION_PATH_VALUE = "getlocationpath";
	public static final String GET_VERSION_HISTORY_VALUE = "getversionhistory";
	public static final String CHANGE_PASSWORD_VALUE = "changepassword";
	public static final String DELETE_PROFILE_PHOTO_VALUE = "deleteprofilephoto";
	public static final String USER_QUERY_KEY_NAME = "searchStr";
	public static final String LIMIT_KEY_NAME = "limit";
	public static final String PAGE_SIZE_KEY_NAME = "pageSize";
	public static final String PAGE_NUMBER_KEY_NAME = "pageNumber";
	public static final String MAX_HISTORY_SIZE_KEY = "maxHistorySize";
	public static final String NUM_ROWS_KEY_NAME = "numRows";
	public static final String ASCENDING_KEY_NAME = "ascending";
	public static final String SORT_KEY_NAME = "sort";
	public static final String SORT_DIRECTION_NAME = "dir";
	public static final String MAX_RESULTS_KEY_NAME = "maxResults";
	public static final String MAX_DEPTH_KEY_NAME = "maxDepth";
	public static final String PAGE_KEY_NAME = "page";
	public static final String DESCENDING_KEY_NAME = "desc";
	public static final String CONTAINER_ID_KEY_NAME = "containerID";
	public static final String SORT_ON_KEY_NAME = "sortOn";
	public static final String SORT_DESC_KEY_NAME = "sortDescending";
	public static final String USER_SEARCH_VALUE = "usersearch";
	public static final String REST_API_KEY_NAME = "rest";
	public static final String UPLOAD_KEY_VALUE = "upload";
	public static final String UPLOAD_VERSION_KEY_VALUE = "uploadversion";
	public static final String UPLOAD_PROFILE_PHOTO_KEY_VALUE = "uploadprofilephoto";
	public static final String CONTENT_TYPE_KEY_VALUE = "content";
	public static final String FUNC_KEY_NAME = "func";
	public static final String OTSYNC_FUNC_VALUE = "otsync.otsyncrequest";
	public static final String VERSION_KEY_REST_NAME = "versionNum";
	public static final String SHORT_POLL_KEY_NAME = "shortPoll";
	public static final String SET_HASH_VALUE = "sethash";
	public static final String HASH_LIST_KEY_NAME = "hashList";
	public static final String DATA_HASH_KEY_NAME = "dataHash";
	public final static String RESERVE_KEY_NAME = "reserve";
	public final static String RESERVE_VALUE = "reserve";
	public final static String UNRESERVE_VALUE = "unreserve";
	public static final String SEQ_NO_REST_KEY_NAME = "since";
	public static final String EVENT_LOG_KEY_NAME = "eventLog";
	public static final String AUTO_MODE_KEY_NAME = "auto";
	public static final String STORAGE_LIMIT_VALUE = "getUserStorageLimit";
	public static final String GET_TEMPO_TASKS_VALUE = "getTempoTasks";
	public static final String CREATE_TEMPO_TASKS_VALUE = "createTempoTasks";
	public static final String UPDATE_TEMPO_TASK_VALUE = "updateTempoTask";
        
    public static final String CLIENT_OS_KEY_NAME = "os";
	public static final String CLIENT_OSVERSION_KEY_NAME = "osVersion";
    public static final String CLIENT_VERSION_KEY_NAME = "version";
    public static final String CLIENT_BITNESS_KEY_NAME = "bitness";
    public static final String CLIENT_LANGUAGE_KEY_NAME = "language";
    public final static String CLIENT_CURRENTVERSION_KEY_VALUE = "clientVersion";
	public final static String CLIENT_NEEDS_UPGRADE = "clientNeedsUpgrade";
	public final static String CLIENT_CURRENT_RET_KEY = "clientCurVersion";
	public final static String CLIENT_MIN_RET_KEY = "clientMinVersion";
	public final static String CLIENT_LINK_RET_KEY = "clientLink";
	public final static String CLIENT_OS_RET_KEY = "clientOS";
	public static final String CLIENT_TYPE_KEY_NAME = "clientType";
	public static final String CLIENT_DEVICE_ID_KEY_NAME = "deviceID";
	public static final String CLIENT_LOCATION_KEY_NAME = "location";
	public static final String CLIENT_CLOUD_PUSH_KEY_NAME = "cloudPushKey";
	public static final String GET_SETINGS_VALUE = "getsettings";
	public static final String SET_SETINGS_VALUE = "setsettings";
	public static final String SET_NOTIFY_VALUE = "setsharenotify";
	public static final String SHARE_NOTIFY_KEY_NAME = "notify";
	public static final String ALLOW_DEFAULT = "allowDefault";
	public static final String TYPE = "type";
	public static final String IMPERSONATE_KEY_NAME = "impersonate";
	public static final String UNSUBSCRIBE_VALUE = "unsubscribe";

	public static final String GET_NODE_DETAILS_FUNC = "otsync.getnodedetails";
	public static final String SET_CAT_ATTS_FUNC = "otsync.UpdateCategoryData";
    public static final String DELETE_THUMBNAIL_FUNC = "otsync.deletefolderthumbnail";
    public static final String SET_THUMBNAIL_FUNC = "otsync.setfolderthumbnail";
	public static final String GET_PROPERTIES_FUNC = "otsync.properties";
	public static final String APPLY_PERMS_FUNC = "otsync.applyperms";

    public static final String CREATE_APP_ROOT_FUNC = "otsync.createapproot";
    public static final String GET_SUB_APP_ROOTS_FUNC = "otsync.getsubapproots";

    public static final String CHANGE_APP_ROOT_VISIBILITY_FUNC = "otsync.changeapprootvisibility";
    public static final String GET_APP_ROOT_VISIBILITY_FUNC = "otsync.getapprootvisibility";

    public static final String ADD_VIRTUAL_CHILD_FUNC = "otsync.addvirtualchild";
    public static final String GET_VIRTUAL_CHILDREN_FUNC = "otsync.getvirtualchildren";
    public static final String DELETE_VIRTUAL_CHILD_FUNC = "otsync.removevirtualchildren";

    public static final String CREATE_SYSTEM_SHARE_FUNC = "otsync.createsystemshare";
    public static final String CHANGE_SYSTEM_SHARE_FUNC = "otsync.changesystemshare";
    public static final String DELETE_SYSTEM_SHARE_FUNC = "otsync.deletesystemshare";
    public static final String GET_SYSTEM_SHARES_FUNC = "otsysn.getsystemshares";

    public static final String CHANGE_APP_ROOT_FUNC = "otsync.changeapproot";
    public static final String DELETE_APP_ROOT_FUNC = "otsync.deleteapproot";

    public static final String ADD_APP_ROOT_BULK_PERM_FUNC = "otsync.addbulkperm";

    public static final String ADD_APP_ROOT_USER_FUNC = "otsync.addapprootuser";
    public static final String REMOVE_APP_ROOT_USER_FUNC = "otsync.removeapprootuser";

    public static final String GET_APP_ROOT_NODE_ID_FUNC = "otsync.getapprootid";

	public String getType() {
		return (String)_map.get(TYPE_KEY_NAME.toLowerCase());
	}

	private final Map<String, Object> _map;
	private final ResponseHandler _responseHandler;
	private final SynchronousMessageSwitch _messageHandler;
	
	public Message(final Map<String, Object> map, final ResponseHandler responseHandler, final SynchronousMessageSwitch messageHandler){
		_map = map;
		_responseHandler = responseHandler;
		_messageHandler = messageHandler;
	}

	public Map<String, Object> getMap() {
		return _map;
	}
	
	public ResponseHandler getResponseHandler(){
		return _responseHandler;
	}

	@Override
	public void resume() {
		_messageHandler.processAndRespondTo(this);
	}

	@Override
	public String logType() {
		return getType();
	}
	
	@Override
	public String subType() {
		Object subType = getMap().get(Message.SUBTYPE_KEY_NAME);
		if(subType != null)
			return subType.toString();
		else
			return "not provided";
	}
	
	@Override
	public String clientID() {
		Object clientID = getMap().get(Message.CLIENT_ID_KEY_NAME);
		if(clientID != null)
			return clientID.toString();
		else
			return "not provided";
	}
	
	public static HashMap<String, Object> makePayload(String type, String subtype, HttpServletRequest req) {
		HashMap<String, Object> payload = new HashMap<String, Object>();
		payload.put(TYPE_KEY_NAME, type);
		if(subtype != null){
			payload.put(SUBTYPE_KEY_NAME, subtype);
		}
		
		payload.put(REST_API_KEY_NAME, true);
		
		String clientID = req.getParameter(Message.CLIENT_ID_KEY_NAME);
		String id;
		if (req.getParameter(Message.TRANSACTIONID_KEY_NAME) != null) {
			id = req.getParameter(Message.TRANSACTIONID_KEY_NAME);
		}
		else {
			id = req.getParameter(Message.ID_KEY_NAME);
		}
		
		if(clientID != null)
			payload.put(Message.CLIENT_ID_KEY_NAME, clientID);
		if(id != null)
			payload.put(Message.ID_KEY_NAME, id);
		
		infoPut(payload, Message.PAGE_SIZE_KEY_NAME, req.getParameter(Message.PAGE_SIZE_KEY_NAME));
		infoPut(payload, Message.PAGE_NUMBER_KEY_NAME, req.getParameter(Message.PAGE_NUMBER_KEY_NAME));
		
		return payload;
	}

	/**
	 * Utility message to get a string field from a message map, handling nulls and
	 * incorrect classes by returning an empty string.
	 * @param message
	 * @param field
	 * @return
	 */
	public static String getFieldAsString(Map<String, Object> message, String field){
		Object rawField = message.get(field);
		if(rawField != null && rawField instanceof String){
			return (String) rawField;
			
		} else {
			return "";
		}
	}
	
	/**
	 * Utility to get the info object from a message, returning an empty map
	 * if it is missing or of the wrong type.
	 * @param message
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> getInfo(Map<String, Object> message){
		Map<String, Object> info = new HashMap<>();
		
		Object infoObj = message.get(Message.INFO_KEY_NAME);
		
		if(infoObj != null && infoObj instanceof Map<?, ?>){
			info = (Map<String, Object>)infoObj;
		}
		
		return info;
	}

	public static void infoPut(HashMap<String, Object> payload,
			String key, Object value) {
		if(value == null) return;
		
		Object infoObj = payload.get(Message.INFO_KEY_NAME);
		
		if(infoObj == null){
			infoObj = new HashMap<String, Object>();
			payload.put(Message.INFO_KEY_NAME, infoObj);
		}
		
		@SuppressWarnings("unchecked")
		Map<String, Object> info = (Map<String, Object>)infoObj;
		
		info.put(key, value);
	}
}
