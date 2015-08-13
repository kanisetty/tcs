package com.opentext.ecm.otsync.ws.server.rest;

public class AppRootSystemShare extends ResourcePath {

    public AppRootSystemShare() {
        this.addSubPath(new AppRootSystemShareID());
    }

    @Override
    protected String getPath() {
        return "systemshare";
    }
}
