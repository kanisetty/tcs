package com.opentext.ecm.otsync.ws.server.rest.resources.shares;


import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

public class OutgoingShareUsers extends ResourcePath {

    public OutgoingShareUsers() {
        this.addSubPath(new OutgoingShareUserID());
    }

    @Override
    protected String getPath() {
        return "users";
    }
}
