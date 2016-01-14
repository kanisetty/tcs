package com.opentext.otsync.content.listeners;

import com.opentext.otsync.content.payload.Payload;

import java.io.IOException;

public interface MessageForwarder {
    Payload forwardRequest(Payload payload) throws IOException;
}
