package com.opentext.otag.request;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class Payload {
  private String jsonString;
  private final static ObjectMapper jsonMapper = new ObjectMapper();
  private Map<String,Object> fields;

  public Payload() {
    fields = new HashMap<String, Object>();
    fields.put("rest",true);
    fields.put("type","request");
  }

  public Payload subType(String subtype) {
    fields.put("subType",subtype);
    return this;
  }

  public Payload info(Map<String, Object> info) {
    fields.put("info",info);
    return this;
  }

  public String toJson() {
    if(jsonString == null){
      StringWriter jsonWriter = new StringWriter();
      try {
        jsonMapper.writeValue(jsonWriter, fields);
      } catch (IOException e) {

      }
      jsonString = jsonWriter.toString();
    }
    return jsonString;
  }
}
