package com.opentext.ecm.otsync.ws.server.rest;

public class Clients extends ResourcePath {
	
	public Clients() {
		this.addSubPath(new ClientID());
	}
	
	@Override
	protected String getPath() {
		return "clients";
	}
}
