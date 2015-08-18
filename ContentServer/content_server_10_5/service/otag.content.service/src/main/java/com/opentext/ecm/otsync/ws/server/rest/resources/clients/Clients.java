package com.opentext.ecm.otsync.ws.server.rest.resources.clients;

import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

public class Clients extends ResourcePath {
	
	public Clients() {
		this.addSubPath(new ClientID());
	}
	
	@Override
	protected String getPath() {
		return "clients";
	}
}
