package com.opentext.ecm.otsync.payload;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.ecm.otsync.message.Message;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * Payload abstracts the difference between the json string and map representations of the payload.
 * A Payload may be created from either a json string or a Map of key-value pairs.
 * In either case, the user may transparently access the json string and the values as needed.
 * Note that the first time the other format is used (e.g. set a field after constructing from a string)
 * there will be a slight time penalty to do the conversion.
 * <p>
 * This class is thread-safe but not thread-optimized: plan to handle a given Payload in only one thread,
 * and provide other threads their own copy to avoid blocking.
 */
public class Payload {

    public Payload(String jsonString) {
        if (jsonString == null) {
            throw new NullPointerException();
        }

        this.jsonString = jsonString;
        // invariant: at most one of this.fields and this.jsonString are null
    }

    public Payload(Map<String, Object> fields) {
        // copy the map so the original doesn't get modified via this Payload object
        this.fields = new HashMap<>();
        if (fields != null) {
            this.fields.putAll(fields);
        }
        // invariant: at most one of this.fields and this.jsonString are null
    }

    public Payload() {
        this.fields = new HashMap<>();
    }

    @Override
    /**
     * Return a clone of the Payload that can be concurrently modified by another thread without blocking.
     * Note that if any fields have mutable objects as their value (e.g. a List), modifying these objects is not thread-safe.
     * It is always safe to get and set values on the clone, however.
     */
    public synchronized Payload clone() {
        Payload theClone = new Payload(this.jsonString);

        // if this payload has a map version, copy it into the new one
        if (fields != null) {
            theClone.fields = new HashMap<>();
            theClone.fields.putAll(fields);
        }

        return theClone;
    }

    public synchronized String getJsonString() throws IOException {
        initializeJsonStringIfNull();

        return jsonString;
    }

    /**
     * Returns the value of the named field. Callers should not modify the return value.
     *
     * @param field
     * @return
     * @throws JsonProcessingException
     * @throws IOException
     */
    public synchronized Object getValue(String field) throws IOException {
        initializeFieldsIfNull();

        return fields.get(field);
    }

    public String getValueAsString(String field) throws IOException {
        try {
            return getValue(field).toString();
        } catch (NullPointerException e) {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public Payload getInfo() throws IOException {
        Map<String, Object> infoMap;
        try {
            infoMap = (Map<String, Object>) getValue(Message.INFO_KEY_NAME);
        } catch (ClassCastException e) {
            infoMap = new HashMap<>();
        }

        return new Payload(infoMap);
    }

    synchronized public void setValue(String field, Object value) throws IOException {
        initializeFieldsIfNull();

        fields.put(field, value);

        // invalidate the current json string, if any, so it will be regenerated when required
        jsonString = null;
    }

    synchronized public void remove(String field) throws IOException {
        initializeFieldsIfNull();

        fields.remove(field);

        // invalidate the current json string, if any, so it will be regenerated when required
        jsonString = null;
    }

    private Map<String, Object> fields = null;
    private String jsonString = null;
    private final static ObjectMapper jsonMapper = new ObjectMapper();

    /**
     * Call before accessing the Map of fields; initializes from the json string if necessary.
     *
     * @throws IOException
     */
    synchronized private void initializeFieldsIfNull() throws IOException {
        if (fields == null) {
            fields = jsonMapper.readValue(jsonString, new TypeReference<Map<String, Object>>() {
            });
        }
    }

    /**
     * Call before accessing the json string; initializes from the Map of fields if necessary.
     *
     * @throws IOException
     */
    synchronized private void initializeJsonStringIfNull() throws IOException {
        if (jsonString == null) {
            StringWriter jsonWriter = new StringWriter();
            jsonMapper.writeValue(jsonWriter, fields);
            jsonString = jsonWriter.toString();
        }
    }

    public synchronized Map<String, Object> getMap() throws IOException {
        initializeFieldsIfNull();

        return fields;
    }
}
