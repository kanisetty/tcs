package com.opentext.ecm.otsync.ws.message;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

public class JsonMessageConverter implements MessageConverter, MessageConverter.Deserializer,
        MessageConverter.Serializer {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public Deserializer getDeserializer() {
        return this;
    }

    public Serializer getSerializer() {
        return this;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> deserialize(String stringMessage) throws IOException {
        try {
            return (Map<String, Object>) MAPPER.readValue(stringMessage, Map.class);
        } catch (ClassCastException e) {
            IOException ioe = new IOException();
            ioe.initCause(e);
            throw ioe;
        }
    }

    public String serialize(Map<String, Object> objectMessage) throws IOException {
        return MAPPER.writeValueAsString(objectMessage);
    }
}
