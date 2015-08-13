package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.engine.core.SuspendedAction;
import com.opentext.ecm.otsync.engine.core.SuspendedActionQueue;
import com.opentext.ecm.otsync.gateway.GatewayServices;
import com.opentext.ecm.otsync.http.HTTPRequest;
import com.opentext.ecm.otsync.http.RequestHeader;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.payload.Payload;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import com.opentext.ecm.otsync.ws.server.AbstractChunkedContentChannel;
import com.opentext.otag.api.shared.types.notification.NotificationRequest;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

/**
 * Tracks the number of uploads and downloads and sends out authorizations to download/upload
 * when not too many are pending.
 * The maximum number of uploads and downloads is a slightly elastic number: authorizations will be issued so
 * long as there are fewer than the maximum currently in process, meaning that if several authorization requests come
 * at once, there may be some overshoot. The content channel should manage this by checking the return value of
 * requestUp/Download() and sending the request back for another authorization if it returns false.
 * 
 * Unauthorized up/downloads from a given ip will be rejected, but authorized one's may sometimes be rejected too if too many
 * authorizations are pending (e.g. if the client waits a long time before executing the upload). In either case, the
 * client should then get authorization by sending a chunkedContentRequest message.
 * 
 * Note that only one outstanding authorization per ip is allowed: a client must at least initiate the up/download it has been authorized
 * for before it can request another (multiple requests can be made, but only the last authorization counts).
 *
 */
public class ChunkedContentRequestQueue {

	public static final String COULD_NOT_SEND_UPLOAD_REQUEST_ERROR_MSG = "Could not send upload request to server";
	public static final String MISSING_PARAMETER_ERROR_MSG = "either url or nodeID parameter is required";
	public static final String CLIENT_LLCOOKIE_PARAMETER_NAME = "LLCookie";
	public static final String CLIENT_PARENTID_PARAMETER_NAME = "parentID";
	public static final String NOT_ALLOWED_ERROR_MESSAGE = "max downloads or uploads in progress or unauthorized; send contentRequest";
	public static final String INTERNAL_SERVER_ERROR_MESSAGE = "An internal server error has occurred.";
	public static final String NO_RESPONSE_ERROR_MSG = "Could not get response";
	public static final String CS_COOKIE_NAME = "LLCookie";
	private final Map<String, Request> _downloadsInProgress;
	private final Map<String, Request> _uploadsInProgress;
	private final HTTPRequest _contentServerConnection;
	private final MessageConverter _messageConverter;
	private final SuspendedActionQueue _sharedThreadPool;

	private static final Log log = LogFactory.getLog(ChunkedContentRequestListener.class);
	
	private class Request{
		public String id;
		public String ip;
		public String llcookie;
		public String tempFilename;
		public String realFilename;
		public long offset;
		public String boundary;
		public long timestamp;

		public Request(final String id, final String ip){
			this.id = id;
			this.ip = ip;
			this.llcookie = "";
			this.tempFilename = "";
			this.realFilename = "";
			this.offset = Long.valueOf(0);
			this.boundary = "";
			this.timestamp = System.currentTimeMillis();
		}
	}

	public ChunkedContentRequestQueue(
			final HTTPRequest contentServerConnection, 
			final MessageConverter messageConverter, 
			final SuspendedActionQueue sharedThreadPool) throws ServletException {
		cleanAllCacheFiles();  // make sure there are no orphaned cache files
		_downloadsInProgress = Collections.synchronizedMap(new HashMap<String, ChunkedContentRequestQueue.Request>());
		_uploadsInProgress = Collections.synchronizedMap(new HashMap<String, ChunkedContentRequestQueue.Request>());
    	_contentServerConnection = contentServerConnection;
    	_messageConverter = messageConverter;
    	_sharedThreadPool = sharedThreadPool;
	}
	
	public void downloadFile(final HttpServletRequest request, final HttpServletResponse response, final String url, final String llcookie) {
		final String remoteAddr = request.getRemoteAddr();
		Request dlReq = getDownloadInProgressRequest(remoteAddr, url, llcookie);
		final String key = remoteAddr + url;
		
		if (dlReq == null) {	//download has not been started yet; enqueue for an available thread

			AsyncContext async = request.startAsync();
			async.setTimeout(ServletConfig.getServlet3ContentTimeout());
			
			SuspendedAction downloadAction = 
				new Download(async)
					.url(url)
					.llcookie(llcookie)
					.remoteAddr(remoteAddr)
					.key(key)
					.headers(new RequestHeader(request));
			
			_sharedThreadPool.sendImmediately(downloadAction);
			// suspended action will close the request later
		}

		else {
			sendNextPart(response, remoteAddr, dlReq, key);
			AbstractChunkedContentChannel.closeResponse(response);
		}
	}

	private void sendNextPart(final HttpServletResponse response, final String remoteAddr,
			final Request dlReq, final String key) {
		
		FileInputStream in = null;
		
		try {
			in = new FileInputStream(ServletConfig.getTempfileDir() + dlReq.tempFilename);
			final byte[] chunk = new byte[(int)ServletConfig.getChunkSize()];
			in.skip(dlReq.offset);
			final int numBytesRead = in.read(chunk);
			in.close();
			if (numBytesRead == -1) {
				//remove the request from the downloads in progress
				removeTempFile(dlReq.tempFilename);
				_downloadsInProgress.remove(key);
			}
			else {
				response.addHeader("Content-Length", Integer.toString(numBytesRead));
				response.addHeader("Content-Disposition", "attachment; filename=" + dlReq.realFilename);
				response.getOutputStream().write(chunk, 0, numBytesRead);
				dlReq.offset += ServletConfig.getChunkSize();
				dlReq.timestamp = System.currentTimeMillis();
			}
		}
		catch (FileNotFoundException ex) {
			endDownloadOnError(response, remoteAddr, key);
		}
		catch (IOException ex) {
			endDownloadOnError(response, remoteAddr, key);
		}
		finally {
			if(in != null){
				try {
					in.close();
				} catch (IOException e) {
					endDownloadOnError(response, remoteAddr, key);
				}
			}
		}
	}

	private void endDownloadOnError(final HttpServletResponse response,
			final String remoteAddr, final String key) {
		_downloadsInProgress.remove(key);
		ServletUtil.error(response, INTERNAL_SERVER_ERROR_MESSAGE, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	}
	
	public void removeTempFile(final String filename) {
		final File file = new File(ServletConfig.getTempfileDir() + filename);
		file.delete();
	}
	
	public class Download extends SuspendedAction {
		private AsyncContext asyncRequest;
		private String url;
		private String llcookie;
		private RequestHeader headers;
		private String remoteAddr;
		private String key;

		// Using named parameter idiom; use like this:
		// new Download(async).url("blah").llcookie("234kjhskf").filename("foo.txt").headers(headerObj).remoteAddr(addr).key("key");
		// Then call store() to get the file to the Engine machine
		private Download(AsyncContext asyncRequest) {
			this.asyncRequest = asyncRequest;
		}
		
		private Download url(String url){
			this.url = url;
			return this;
		}
		
		private Download llcookie(String llcookie){
			this.llcookie = llcookie;
			return this;
		}
		
		private Download headers(RequestHeader headers){
			this.headers = headers;
			return this;
		}
		
		private Download remoteAddr(String remoteAddr){
			this.remoteAddr = remoteAddr;
			return this;
		}
		
		private Download key(String key){
			this.key = key;
			return this;
		}

		@Override
		public void resume() {
			final String tempFilename = UUID.randomUUID().toString();
			String realFilename = "";
			HttpServletResponse response = (HttpServletResponse)asyncRequest.getResponse();

			try {
				if (llcookie != null) {
					realFilename = _contentServerConnection.storeGetResponseWithUserCookie(url, response, CS_COOKIE_NAME, llcookie, tempFilename, headers);
				} else {
					realFilename = _contentServerConnection.storeGetResponse(url, response, tempFilename);
				}
			} catch (IOException e) {
				ServletUtil.error(response, NO_RESPONSE_ERROR_MSG, HttpServletResponse.SC_NO_CONTENT);
				asyncRequest.complete();
			}
			
			Request newDownloadRequest = null;
			
			if (!"".equals(realFilename)) {
				// we only needed the client id (Request constructor's 1st parameter) when sending an authorization, so we set it to null
				// we could get it from the request if it turns out to be necessary
				newDownloadRequest = new Request(null, remoteAddr);
				newDownloadRequest.llcookie = llcookie;
				newDownloadRequest.tempFilename = tempFilename;
				newDownloadRequest.realFilename = realFilename;
				_downloadsInProgress.put(key, newDownloadRequest);
				
				sendNextPart(response, remoteAddr, newDownloadRequest, key);
				
				asyncRequest.complete();
			}
		}

		@Override
		public String logType() {
			return "chunked download";
		}
	}
	
	synchronized public void uploadFile(final HttpServletRequest request, final HttpServletResponse response) throws IOException {
		String key = null;
		String nodeID = null;
		String llcookie = null;
		String filename = null;
		boolean isLastPart = false;
		boolean isFirstPart = false;
		boolean isUpload = false;
		boolean isPhoto = false;
		Request ulReq = null;
		final ServletFileUpload upload = new ServletFileUpload();
		byte[] chunkData = null;
		final Map<String, Object> jsonPayload = new HashMap<String, Object>();
		int chunkDataLen = 0;

        final RequestHeader headers = new RequestHeader(request);
		final String remoteAddr = request.getRemoteAddr();
		
		//unfortunately, we have to parse the full multipart request before we can check
		//if this user is even allowed to upload a file, since the parentID is contained
		//inside the request, and we cannot guarantee in which order. The MultipartParser
		//class will discard the data once it has been read.
		try {
			final FileItemIterator iter = upload.getItemIterator(request);
			final byte[] buffer = new byte[(int)ServletConfig.getChunkSize()];
			
			while (iter.hasNext()) {
				final FileItemStream item = iter.next();
				final String name = item.getFieldName();
				final InputStream in = item.openStream();
				
				if (Message.VERSION_FILE_KEY_NAME.equalsIgnoreCase(name) || Message.PHOTO_FILE_KEY_NAME.equalsIgnoreCase(name)) {
					filename = item.getName();
	
					final ByteArrayOutputStream data = new ByteArrayOutputStream();
					int len;
					chunkDataLen = 0;
					while ((len = in.read(buffer)) != -1) {
						//check to make sure we're not about to read larger than our chunk size
						final int afterWriteLen = chunkDataLen + len;
						if (afterWriteLen > ServletConfig.getChunkSize()) {
							//if the chunk that the user is uploading IS larger than the
							//configured chunk size, only read up to the chunk size and stop. 
							len = (int)ServletConfig.getChunkSize() - chunkDataLen;
						}
						
						//write the chunk data to our stream
						data.write(buffer, 0, len);
						chunkDataLen += len;
						
						//if we have read enough to fill the chunk, break
						if (chunkDataLen >= ServletConfig.getChunkSize()) {
							break;
						}
					}
					chunkData = data.toByteArray();
					data.close();
				}
				else if (Message.PAYLOAD_KEY_NAME.equalsIgnoreCase(name)) {
					try {
						final Map<String, Object> payload = (Map<String, Object>)_messageConverter.getDeserializer().deserialize(Streams.asString(in));
						if("uploadprofilephoto".equalsIgnoreCase(Message.getFieldAsString(payload, Message.SUBTYPE_KEY_NAME))){
							isPhoto = true;
						}
						@SuppressWarnings("unchecked")
						final Map<String, Object> info = (Map<String, Object>) payload.get(Message.INFO_KEY_NAME);
						if(!isPhoto){
							isUpload = info.containsKey(Message.PARENT_ID_KEY_NAME);
							nodeID = (String)((isUpload) ? info.get(Message.PARENT_ID_KEY_NAME) : info.get(Message.NODE_ID_KEY_NAME));
						}
						llcookie = (String) payload.get(Message.CSTOKEN_KEY_NAME);
						if(info != null){
							isLastPart = Boolean.parseBoolean((String) info.get(Message.LAST_PART_KEY_NAME));
						}
											
						jsonPayload.put(Message.CLIENT_ID_KEY_NAME, payload.get(Message.CLIENT_ID_KEY_NAME));
						jsonPayload.put(Message.CSTOKEN_KEY_NAME, payload.get(Message.CSTOKEN_KEY_NAME));
						jsonPayload.put(Message.USERNAME_KEY_NAME, payload.get(Message.USERNAME_KEY_NAME));
						jsonPayload.put(Message.PASSWORD_KEY_NAME, payload.get(Message.PASSWORD_KEY_NAME));					
					}
					catch (EOFException ex) {
						//llcookie, parentID are already null, and there is logic below to handle this exception
					}
				}
			}
		}
		catch (FileUploadException ex) {
			ServletUtil.error(response, INTERNAL_SERVER_ERROR_MESSAGE, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		
		if (filename != null && (isPhoto || nodeID != null) && llcookie != null && chunkData != null) {
			key = remoteAddr + nodeID + filename;
			ulReq = getUploadInProgressRequest(remoteAddr, nodeID, filename, llcookie);
			
			if (ulReq == null) {	//upload has not been started yet

				ulReq = startUpload(key, llcookie, filename, remoteAddr);
				isFirstPart = true;
			}

			if (ulReq != null) {
				//append file data
				final FileOutputStream out = new FileOutputStream(ServletConfig.getTempfileDir() + ulReq.tempFilename, true);

				try{
					if (isFirstPart) {
						storeInitialUploadPart(nodeID, ulReq, jsonPayload, out, isUpload, isPhoto);
					}

					out.write(chunkData, 0, chunkDataLen);

					if (isLastPart) {
						completeUpload(request, key, ulReq, remoteAddr, out, headers);
						// response will be closed by the suspended action
					}
					else {
						completeUploadPart(ulReq, remoteAddr, out);
						AbstractChunkedContentChannel.closeResponse(response);
					}
				}
				finally {
					out.close();
				}
			}
		}
		else { //no file, or parentID, or llcookie was included with this multipart post! invalidate tokens
			ServletUtil.error(response, INTERNAL_SERVER_ERROR_MESSAGE, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			_uploadsInProgress.remove(key);
		}
	}

	private Request startUpload(final String key, final String llcookie, final String filename,
			final String remoteAddr) {
		
		final UUID uuid = UUID.randomUUID();
		
		// we only needed the client id (Request constructor's 1st parameter) when sending an authorization, so we set it to null
		// we could get it from the payload if it becomes useful in future
		final Request ulReq = new Request(null, remoteAddr);
		ulReq.llcookie = llcookie;
		ulReq.tempFilename = uuid.toString();
		ulReq.realFilename = filename;
		_uploadsInProgress.put(key, ulReq);
		
		return ulReq;
	}

	private void storeInitialUploadPart(final String nodeID, final Request ulReq,
			final Map<String, Object> jsonPayload, final FileOutputStream out, final boolean isUpload, boolean isPhoto)
			throws UnsupportedEncodingException, IOException {
		
		jsonPayload.put(Message.TYPE_KEY_NAME, "content");
		if(isPhoto){
			jsonPayload.put(Message.SUBTYPE_KEY_NAME, "uploadprofilephoto");
		}
		else{
			jsonPayload.put(Message.SUBTYPE_KEY_NAME, (isUpload) ? "upload" : "uploadversion");
			final Map<String, Object> payloadInfo = new HashMap<String, Object>();
			payloadInfo.put((isUpload) ? Message.PARENT_ID_KEY_NAME : Message.NODE_ID_KEY_NAME, nodeID);
			payloadInfo.put(Message.NAME_KEY_NAME, ulReq.realFilename);
			jsonPayload.put(Message.INFO_KEY_NAME, payloadInfo);
		}

		//add multipart post data to the beginning of the file
		ulReq.boundary = ("-------------------------" + System.currentTimeMillis() / 1000);
		final byte[] boundaryBytesNoInitialLF = ("--" + ulReq.boundary + "\r\n").getBytes(ServletConfig.CHAR_ENCODING);
		final byte[] boundaryBytes = ("\r\n--" + ulReq.boundary + "\r\n").getBytes(ServletConfig.CHAR_ENCODING);
		out.write(boundaryBytesNoInitialLF);
		out.write("Content-Disposition: form-data; name=\"func\"\r\n\r\n".getBytes(ServletConfig.CHAR_ENCODING));
		out.write("otsync.otsyncrequest".getBytes(ServletConfig.CHAR_ENCODING));
		out.write(boundaryBytes);
		out.write("Content-Disposition: form-data; name=\"payload\"\r\n\r\n".getBytes(ServletConfig.CHAR_ENCODING));
		String payloadString = _messageConverter.getSerializer().serialize(jsonPayload);
		out.write(payloadString.getBytes(ServletConfig.CHAR_ENCODING));
		out.write(boundaryBytes);
		if(isPhoto){
			out.write( ("Content-Disposition: form-data; name=\"Photo\"; filename=\"" + ulReq.realFilename + "\"\r\n").getBytes(ServletConfig.CHAR_ENCODING) );
		}
		else{
			out.write( ("Content-Disposition: form-data; name=\"versionFile\"; filename=\"" + ulReq.realFilename + "\"\r\n").getBytes(ServletConfig.CHAR_ENCODING) );
		}
		out.write("Content-Type: application/octet-stream\r\n\r\n".getBytes(ServletConfig.CHAR_ENCODING));
	}

	private void completeUploadPart(final Request ulReq, final String remoteAddr,
			final FileOutputStream out) throws IOException {
		
		out.close();
		ulReq.timestamp = System.currentTimeMillis();
	}

	private void completeUpload(final HttpServletRequest request, final String key,
			final Request ulReq, final String remoteAddr, final FileOutputStream out, final RequestHeader headers)
	
			throws UnsupportedEncodingException, IOException {
		
		//add end of multipart data
		final byte[] boundaryBytes = ("\r\n--" + ulReq.boundary + "\r\n").getBytes(ServletConfig.CHAR_ENCODING);
		out.write(boundaryBytes);
		out.write("--\r\n".getBytes(ServletConfig.CHAR_ENCODING));
		out.close();
		
		_uploadsInProgress.remove(key);
		
		AsyncContext async = request.startAsync();
		async.setTimeout(ServletConfig.getServlet3ContentTimeout());

		SuspendedAction uploadAction =
			new Upload(async)
				.boundary(ulReq.boundary)
				.headers(headers)
				.llcookie(ulReq.llcookie)
				.localFilePath(ServletConfig.getTempfileDir() + ulReq.tempFilename)
				.realFilename(ulReq.realFilename);
		
		_sharedThreadPool.sendImmediately(uploadAction);
	}
	
	public class Upload extends SuspendedAction {
		
		private AsyncContext async;
		private String localFilePath;
		private String realFilename;
		private String boundary;
		private String llcookie;
		private RequestHeader headers;

		private Upload(AsyncContext async){
			this.async = async;
		}
		
		private Upload localFilePath(String localFilePath){
			this.localFilePath = localFilePath;
			return this;
		}
		
		private Upload realFilename(String realFilename){
			this.realFilename = realFilename;
			return this;
		}
		
		private Upload boundary(String boundary){
			this.boundary = boundary;
			return this;
		}
		
		private Upload llcookie(String llcookie){
			this.llcookie = llcookie;
			return this;
		}
		
		private Upload headers(RequestHeader headers){
			this.headers = headers;
			return this;
		}

		@Override
		public void resume() {
			try {
				_contentServerConnection.streamMultipartPost((HttpServletResponse)async.getResponse(), ServletConfig.getContentServerUrl(), 
						localFilePath, realFilename, boundary, llcookie, headers);
				
			} catch (IOException e) {
				log.error("Error during chunked upload", e);
				ServletUtil.error((HttpServletResponse)async.getResponse(), "Error during upload", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				
			} finally {
				async.complete();
			}
			
			removeTempFile(localFilePath);
		}

		@Override
		public String logType() {
			return "chunked upload";
		}
		
	}
	
	public Request getDownloadInProgressRequest(final String remoteAddress, final String url, final String llcookie) {
		final String key = remoteAddress + url;
		final Request req = _downloadsInProgress.get(key);
		if (req != null) {
			if (req.llcookie.equals(llcookie)) {
				return req;
			}
			else {
				//remove the req from the list and return null, bad authorization!
				_downloadsInProgress.remove(key);
				return null;
			}
		}
		else {
			return null;
		}
	}

	public Request getUploadInProgressRequest(final String remoteAddress, final String parentID, final String filename, final String llcookie) {
		final String key = remoteAddress + parentID + filename;
		final Request req = _uploadsInProgress.get(key);
		if (req != null) {
			if (req.llcookie.equals(llcookie)) {
				return req;
			}
			else {
				//remove the req from the list and return null, bad authorization!
				_uploadsInProgress.remove(key);
				return null;
			}
		}
		else {
			return null;
		}
	}

	public void addDownloadRequest(final String clientId, final String clientIp) {
		final Request request = new Request(clientId, clientIp);
		authorizeDownload(request);
	}

	public void addUploadRequest(final String clientId, final String clientIp) {
		final Request request = new Request(clientId, clientIp);
		authorizeUpload(request);
	}

	///
	///
	///
	
	private void authorizeDownload(final Request request) {
		// Clean up any previously unfinished download request 
		// from this remote address becasue we are starting over.

		cleanDownloadRequestsByIP(request.ip);
		sendAuthorizeMessage(request.id, Message.CONTENT_SUBTYPE_DOWNLOAD);
	}

	private void authorizeUpload(final Request request) {
		sendAuthorizeMessage(request.id, Message.CONTENT_SUBTYPE_UPLOAD);
	}

	private void sendAuthorizeMessage(final String clientId, final String subtype) {
		final Payload message = new Payload();
		
		try {
			message.setValue(Message.TYPE_KEY_NAME, Message.CHUNKED_CONTENT_KEY_VALUE);
			message.setValue(Message.SUBTYPE_KEY_NAME, subtype);

			HashSet<String> clientIds = new HashSet<>(Collections.singletonList(clientId));
			NotificationRequest notificationRequest = new NotificationRequest(
					message.getJsonString(), clientIds, new HashSet<String>());

			GatewayServices.getNotificationsClient().sendNotification(notificationRequest);
		} catch (IOException e) {
			// couldn't send the authorization, for whatever reason
			log.warn("Could not send upload or download authorization", e);
		}
	}
	
	private void cleanDownloadRequestsByIP(final String ip) {

    	synchronized(_downloadsInProgress) {
    		Collection<Request> values = _downloadsInProgress.values();
    		Iterator<Request> i = values.iterator();
    		
    		while(i.hasNext()){
    			final Request req = i.next();
    			if (ip.equals(req.ip)){
    				i.remove();
    				removeTempFile(req.tempFilename);
    			}
    		}
        }
	}

	public void cleanDownloadRequests() {
		final long currentTime = System.currentTimeMillis();
		final long expiryDelta = ServletConfig.getChunkedContentCacheExpiryTime() * 1000;

        synchronized(_downloadsInProgress) {
        	for (Map.Entry<String, Request> entry : _downloadsInProgress.entrySet()) {
            	final Request req = entry.getValue();
                if ((currentTime - req.timestamp) > expiryDelta) {
                	removeDownloadRequest(entry.getKey(), req);
                }
            }
    	}
	}
	
	synchronized private void removeDownloadRequest(final String key, final Request req) {
		//we want to clean up the _downloadsInProgress, as well as the cache file associated with it
		
		removeTempFile(req.tempFilename);
		_downloadsInProgress.remove(key);
	}
	
	public void cleanUploadRequests() {
		final long currentTime = System.currentTimeMillis();
		final long expiryDelta = ServletConfig.getChunkedContentCacheExpiryTime() * 1000;

        synchronized(_uploadsInProgress) {
        	Collection<Request> values = _uploadsInProgress.values();
        	Iterator<Request> i = values.iterator();
        	
        	while(i.hasNext()){
        		final Request req = i.next();
        		if ((currentTime - req.timestamp) > expiryDelta) {
        			i.remove();
        			removeTempFile(req.tempFilename);
        		}
        	}
        }
	}
	
	//in the event the server goes down when there are cached files outstanding, 
	//we need to make sure we have a way to clear the cache. 
	//this method should be called when this class is instantiated.
	private void cleanAllCacheFiles() throws ServletException {
		final File directory = new File(ServletConfig.getTempfileDir());
		final File[] files = directory.listFiles();
		if (files != null) {
			for (File file : files) {
			   file.delete();
			}
		}
		else {
			
			final String msg = "Could not access temporary directory. Please check the server configuration."; 
			log.fatal(msg);
			throw( new ServletException(msg) );
		}
	}
}
