package com.opentext.ecm.otsync.ws.server.rest.resources.shares;


import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;
import com.opentext.ecm.otsync.ws.server.rest.resources.shares.OutgoingShareUserID;

public class OutgoingShareUsers extends ResourcePath {
	
	public OutgoingShareUsers() {
		this.addSubPath(new OutgoingShareUserID());
	}
	
	@Override
	protected String getPath() {
		return "users";
	}
}
