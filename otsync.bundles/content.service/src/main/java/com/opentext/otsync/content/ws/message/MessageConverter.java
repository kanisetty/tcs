package com.opentext.otsync.content.ws.message;

import java.io.IOException;
import java.util.Map;

public interface MessageConverter {
    interface Deserializer {
        Map<String, Object> deserialize(String stringMessage) throws IOException;
    }

    interface Serializer {
        String serialize(Map<String, Object> objectMessage) throws IOException;
    }

    Deserializer getDeserializer();

    Serializer getSerializer();
}
