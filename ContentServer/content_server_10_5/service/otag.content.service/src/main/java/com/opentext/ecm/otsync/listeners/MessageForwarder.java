package com.opentext.ecm.otsync.listeners;

import java.io.IOException;

import com.opentext.ecm.otsync.payload.Payload;

public interface MessageForwarder {
    Payload forwardRequest(Payload payload) throws IOException;
}
