package com.opentext.ecm.otsync.ws.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.opentext.ecm.otsync.ws.ServletConfig;

/**
 * Stores the set of known clients (connected or not).
 *
 * The implementation uses a LinkedHashMap to provide constant-time access to each client, and
 * keep the clients ordered by last connection time (oldest first). The LinkedHashMap uses insertion ordering,
 * so when a client connects, this class removes it from the map and re-inserts it so that it goes
 * to the end of the list.
 * 
 * This class guarantees that all operations are thread-safe.
 *
 */
public class ClientSet {
	public final Log log = LogFactory.getLog(ClientSet.class);
	
	private Map<String, Client> clientMap = new HashMap<String, Client>();	
	
	public int size(){
		synchronized (clientMap) {
			return clientMap.size();
		}
	}

	/**
	 * Creates and remembers a new client.
	 * @param userId
	 * @param clientId
	 */
	private Client addNewClient(String userId, String clientId, int maxStoredResponses) {
		
		Client newClient = new Client(userId, clientId, maxStoredResponses);
		
		synchronized (clientMap) {
			clientMap.put(clientId, newClient);
		}
		
		return newClient;
	}

	/**
	 * Gets a client or returns null if that clientId does not exist
	 * @param clientId
	 */
	public Client getClient(String clientId) {
		Client client = null;
		
		synchronized (clientMap) {
			client = clientMap.get(clientId);
		}
		
		return client;
	}


	public boolean clientExists(String clientId) {
		synchronized (clientMap) {
			return(clientMap.containsKey(clientId));			
		}
	}
	
	/**
	 * 	Returns the stored response for the given client and message ids, or null if there is no such stored message
	 * @param clientId
	 * @param messageId
	 * @return the payload returned from CS when the message with this id was sent, or null
	 */
	public Map<String, Object> getLastResponseFor(String clientId, String messageId) throws IOException {
		if(clientId == null) return null;

		Client client;
		synchronized (clientMap) {
			client = clientMap.get(clientId);
		}

		if(client == null){
			// If the client is new to us, but wants retries, create an object for it
			client = addNewClient("unknown", clientId, ServletConfig.getMaxAllowedStoredResponses());
		}
		
		return client.getLastResult(messageId);
	}

	/**
	 * If the given client exists, sets the given message id as pending; until setLastResult is called for this
	 * client and message, getLastResponseFor will return a pending=true response
	 * @param clientId
	 * @param id
	 */
	public void setRequestPending(String clientId, String id) {
		if(clientId == null) return;
		
		Client client;
		synchronized (clientMap) {
			client = clientMap.get(clientId);			
		}
		
		if(client != null){
			client.setRequestPending(id);
		}
	}	
	
	/**
	 * If the given client exists, stores the given payload for the given message id; otherwise does nothing
	 * @param clientId
	 * @param messageId
	 * @param result the payload returned from CS when the message with this id was sent
	 */
	public void setLastResult(String clientId, String messageId, Map<String, Object> result){
		if(clientId == null) return;
		
		Client client;
		synchronized (clientMap) {
			client = clientMap.get(clientId);			
		}
		
		if(client != null){
			client.setLastResult(messageId, result);
		}
	}

	public void setLastResult(String clientId, String messageId, IOException e) {
		if(clientId == null) return;
		
		Client client;
		synchronized (clientMap) {
			client = clientMap.get(clientId);			
		}
		
		if(client != null){
			client.setLastResult(messageId, e);
		}		
	}

	/**
	 * Chooses a client to discard; call in order to free up memory.
	 * The client will be removed from this ClientSet.
	 * @return The client to be discarded.
	 */
	private List<Client> findOldClients() {
		List<Client> clientsRemoved = new ArrayList<Client>();
		Date now = new Date();
		
		// Remove any clients older than the configured ClientTimeOut
		// For the iterator to work properly, no puts or removes can happen while
		// we're using it, so we synchronize this block and any other code in this
		// class that mutates the map.
		synchronized (clientMap) {
			Iterator<Client> i = clientMap.values().iterator();

			long clientTimeOut = ServletConfig.getClientTimeOut();
			while (i.hasNext()) {
				Client client = i.next();
				Long diff = (now.getTime() - client.getLastConnectTime().getTime()) / 1000;
				
				if (diff >= clientTimeOut) {
					clientsRemoved.add(client);
					i.remove();
				}
			}
		}		

		return clientsRemoved;
	}

	public void discard(String victimId) {
		Client victim;
		
		synchronized (clientMap) {
			victim = clientMap.remove(victimId);
		}
		
		if(victim != null){
			victim.close();
		}
	}

	public void discardOldClients() {
		int initialClients = size();
		List<Client> clientsRemoved = findOldClients();
		
		Iterator<Client> i = clientsRemoved.iterator();
		
		while (i.hasNext()) {
			discardAClient(i.next());
		}
		
		int finalClients = size();
		if (log.isWarnEnabled() && initialClients != finalClients) {
			log.warn("Discarded some clients to free up memory: " + (initialClients - finalClients) + " of " + initialClients);
		}
	}

	private boolean discardAClient(Client victim) {
		if(victim != null){
			victim.closeAndSendAuthFalse();

			return true;
		}
		else {
			return false;
		}

		// there should be no references to victim at this point, so it can be garbage-collected by the JVM
	}
}
