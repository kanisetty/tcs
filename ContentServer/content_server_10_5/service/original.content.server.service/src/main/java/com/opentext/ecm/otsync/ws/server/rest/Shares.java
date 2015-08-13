package com.opentext.ecm.otsync.ws.server.rest;


public class Shares extends ResourcePath {
	public Shares() {
		this.addSubPath(new Outgoing());
		this.addSubPath(new Incoming());
	}
	
	@Override
	protected String getPath() {
		return "shares";
	}

}
