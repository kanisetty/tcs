package com.opentext.ecm.otsync.ws.server.rest.resources.approots;

import com.opentext.ecm.otsync.ws.server.rest.ResourcePath;

public class AppRootSystemShare extends ResourcePath {

    public AppRootSystemShare() {
        this.addSubPath(new AppRootSystemShareID());
    }

    @Override
    protected String getPath() {
        return "systemshare";
    }
}
