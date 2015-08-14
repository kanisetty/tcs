package com.opentext.ecm.otsync.ws.server.rest.resources.clients;

import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// TODO FIXME More Client meddling around the wipe
public class ClientID extends ResourcePath {

	private static final int CLIENT_ID_PATH_INDEX = 1;

	public static String getClientID(String[] pathParams) {
		return pathParams[CLIENT_ID_PATH_INDEX];
	}

	public static final String WIPE_OPERATION_NAME = "wipe";
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp,
			String[] pathParams, int version) {
		String clientID = getClientID(pathParams);
//		WipeStatus wipe = WipeStatus.valueOf(req.getParameter(Message.WIPE_KEY_VALUE));
//		String token = getToken(req);
//
//		if(wipe != WipeStatus.complete || token == null){
//			rejectRequest(resp);
//		}
//		else if(!IdentityProvider.getService().checkOneTimeToken(token, "", clientID, WIPE_OPERATION_NAME)){
//			rejectAuth(resp);
//		}
//		else {
//			try {
//				RESTServlet.log.info("Setting wipe complete for client " + clientID);
//
//				EntityManager manager = Setting.emf.createEntityManager();
//				manager.getTransaction().begin();
//
//				Client client = manager.find(Client.class, clientID);
//
//				if(client != null){
//					client.setWipe(WipeStatus.complete);
//					manager.merge(client);
//				}
//
//				manager.getTransaction().commit();
//
//				ServletUtil.write(resp, "{\"ok\":true}");
//			} catch (IOException e) {
//				sendInternalError(resp);
//				RESTServlet.log.error("Error updating client tracking status", e);
//			}
//		}
	}
}
