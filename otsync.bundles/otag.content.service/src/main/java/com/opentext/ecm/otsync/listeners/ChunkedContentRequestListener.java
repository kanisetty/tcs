package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.message.SynchronousMessageListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.HashMap;
import java.util.Map;

public class ChunkedContentRequestListener implements SynchronousMessageListener {

	private static Log log = LogFactory.getLog(ChunkedContentRequestListener.class);

	private ChunkedContentRequestQueue _queue;

	public ChunkedContentRequestListener(ChunkedContentRequestQueue queue) {
		if(queue == null) throw new IllegalArgumentException("null queue parameter");
		_queue = queue;
	}

	public Map<String, Object> onMessage(Map<String, Object> message) {
		String clientId = (String) message.get(Message.CLIENT_ID_KEY_NAME);
		String clientIp = (String) message.get(Message.REMOTE_ADDRESS_KEY_NAME);
		String subtype = (String) message.get(Message.SUBTYPE_KEY_NAME);
		
		if(clientId == null || clientIp == null || subtype == null){
			// can't process without all of these fields; log and discard
			log.warn("Client did not supply an id, clientIp, or subtype");
			return new HashMap<>();
		}

		// check if the request is for an upload or a download, and queue it accordingly
		if(subtype.equalsIgnoreCase(Message.CONTENT_SUBTYPE_DOWNLOAD)){
			_queue.addDownloadRequest(clientId, clientIp);

		} else if(subtype.equalsIgnoreCase(Message.CONTENT_SUBTYPE_UPLOAD)){
			_queue.addUploadRequest(clientId, clientIp);

		}
		
		return new HashMap<>();
	}

}
