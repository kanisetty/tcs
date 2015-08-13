package com.opentext.ecm.otsync.ws.server.rest;


public class OutgoingShareUsers extends ResourcePath {
	
	public OutgoingShareUsers() {
		this.addSubPath(new OutgoingShareUserID());
	}
	
	@Override
	protected String getPath() {
		return "users";
	}
}
