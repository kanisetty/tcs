package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServerConstants;

import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;

public class RememberedResponses {
	private class Request{
		Map<String, Object> response = null;
		boolean isInProgress = true;
		IOException exception = null;
		boolean isException = false;
	}
	
	private final Map<String, Request> idToResult = Collections.synchronizedMap(new LinkedHashMap<String, Request>());
	private final int maxStoredResponses;
	
	public RememberedResponses(final int maxStoredResponses) {
		this.maxStoredResponses = maxStoredResponses;
	}

	/**
	 * Requires that setRequestPending has already been called for this message id
	 * @param id
	 * @param lastResult
	 */
	public void setLastResult(String id, Map<String, Object> lastResult) {
		if(id == null) return;
		
		Request request = idToResult.get(id);
		
		synchronized (request) {
			request.response = lastResult;
			request.isInProgress = false;
		}
	}

	public void setLastResult(String id, IOException e) {
		if(id == null) return;
		
		Request request = idToResult.get(id);
		
		synchronized (request) {
			request.isException = true;
			request.exception = e;
			request.isInProgress = false;
		}
	}

	public Map<String, Object> getLastResult(String id) throws IOException {
		if(id == null) return null;
		
		Request request = idToResult.get(id);
		if(request == null) return null;
		
		Map<String, Object> result;
		
		synchronized (request) {
			if(request.isInProgress){
				
				result = new HashMap<String, Object>();
				result.put(Message.IN_PROGRESS_KEY_NAME, ServerConstants.TRUE_STRING);
				
			} else if (request.isException){
				// throw the stored exception: this ensures that the stored request behaves exactly
				// the same as when it was encountered the first time
				throw request.exception;
				
			} else {				
				result = request.response;
			}
		}
		
		return result;
	}

	public void setRequestPending(String id) {
		if(id == null) return;
		
		idToResult.put(id, new Request());
		
		if(idToResult.size() > maxStoredResponses){
			discardAResponse();
		}
	}

	private void discardAResponse() {
		// get the first entry in the map (the oldest) and remove it
		synchronized(idToResult){
			
			Iterator<Entry<String, Request>> i = idToResult.entrySet().iterator();
			boolean entryWasRemoved = false;
			
			while(!entryWasRemoved && i.hasNext()){
				Entry<String, Request> entry = i.next();
				
				if(!entry.getValue().isInProgress){
					i.remove();
					entryWasRemoved = true;
				}
			}
		}
	}
}