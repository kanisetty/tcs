package com.opentext.otag.request;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.*;

public class JsonHelper {
  private  final ObjectMapper objectMapper = new ObjectMapper();
  private final NameMapper nameMapper;

  public JsonHelper(NameMapper nameMapper) {
    this.nameMapper = nameMapper;
  }

  public  byte[] changeFieldNames(byte[] response) throws IOException {
    JsonNode node = objectMapper.readValue(response, JsonNode.class);
    Object result = convertNodeToObject(node);
    return objectMapper.writeValueAsBytes(result);
  }

  private  Object convertNodeToObject(JsonNode node) throws IOException {
    if (node.isValueNode()){
      return convertValueNodeToObject(node);
    } else if (node.isArray()){
      return convertArrayNodeToObject(node);
    }else{
      return convertObjectNodeToObject(node);
    }
  }

  private  Object convertObjectNodeToObject(JsonNode node) throws IOException {
    Map<String, Object> result = new HashMap<String,Object>();
    Iterator<String> fieldsNameIt = node.getFieldNames();
    while (fieldsNameIt.hasNext()) {
      String name = fieldsNameIt.next();
      String snakeName = nameMapper.nameFor(name);
      JsonNode childJsonNode = node.get(name);

      result.put(snakeName, convertNodeToObject(childJsonNode));
    }

    return result;
  }

  private Object convertArrayNodeToObject(JsonNode node) throws IOException {
    Set<Object> set = new HashSet<Object>();
    Iterator<JsonNode> nodes = node.getElements();
    while (nodes.hasNext()) {
      JsonNode childJsonNode = nodes.next();
      set.add(convertNodeToObject(childJsonNode));
    }

    return set;
  }

  private  Object convertValueNodeToObject(JsonNode node) throws IOException {
    if (node.isBigDecimal()) {
      return node.getBigIntegerValue();
    } else if (node.isBigInteger()) {
      return node.getBigIntegerValue();
    } else if (node.isBinary()) {
      return node.getBinaryValue();
    } else if (node.isBoolean()) {
      return node.getBooleanValue();
    } else if (node.isDouble()) {
      return node.getDoubleValue();
    } else if (node.isInt()) {
      return node.getIntValue();
    } else if (node.isFloatingPointNumber()) {
      return node.getDoubleValue();
    } else if (node.isLong()){
      return node.getLongValue();
    } else if (node.isIntegralNumber())  {
      return node.getIntValue();
    } else if (node.isNumber())     {
      return node.getNumberValue();
    } else if (node.isTextual()){
      return node.getTextValue();
    }else{
      return "";
    }
  }
}
