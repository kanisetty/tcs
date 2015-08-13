package com.opentext.ecm.otsync.ws.message;

import java.io.IOException;
import java.util.Map;

public interface MessageConverter {
    public interface Deserializer {
        public Map<String, Object> deserialize(String stringMessage) throws IOException;
    }

    public interface Serializer {
        public String serialize(Map<String, Object> objectMessage) throws IOException;
    }

    Deserializer getDeserializer();
    Serializer getSerializer();
}
