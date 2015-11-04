package com.opentext.ecm.otsync.listeners;

import com.opentext.ecm.otsync.payload.Payload;

import java.io.IOException;

public interface MessageForwarder {
    Payload forwardRequest(Payload payload) throws IOException;
}
