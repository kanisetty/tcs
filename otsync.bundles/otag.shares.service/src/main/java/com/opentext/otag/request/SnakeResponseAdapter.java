package com.opentext.otag.request;


import com.opentext.otag.request.JsonHelper;
import com.opentext.otag.request.NameMapper;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;

public class SnakeResponseAdapter implements StreamingOutput {
  private final StreamingOutput realOS;
  private static    Map<String, String> keyMap;
  static {
    keyMap = new HashMap<String, String>();
    keyMap.put("serverDate", "server_date");
    keyMap.put("childCount", "child_count");
    keyMap.put("serverDate", "server_date");
    keyMap.put("firstName", "first_name");
    keyMap.put("isAccepted", "is_accepted");
    keyMap.put("isExternalUser", "is_external_user");
    keyMap.put("isOwner", "is_owner");
    keyMap.put("isReadOnly", "is_read_only");
    keyMap.put("lastName", "last_name");
    keyMap.put("modifyDate", "modify_date");
    keyMap.put("modifyUserName", "modify_user_name");
    keyMap.put("ownerID", "owner_id");
    keyMap.put("userID", "user_id");
    keyMap.put("userName", "user_name");
    keyMap.put("APIVersion", "api_version");
    keyMap.put("errMsg", "err_msg");
    keyMap.put("exceptionCode", "exception_code");
    keyMap.put("shareCount", "share_count");
    keyMap.put("tempoBoxRoot", "tempobox_root");
    keyMap.put("personalWorkspaceRoot", "personal_workspace_root");
    keyMap.put("enterpriseWorkspaceRoot", "enterprise_workspace_root");
    keyMap.put("publicTempoVolume", "public_tempo_volume");
  }

  public SnakeResponseAdapter(StreamingOutput streamingOutput) {
    this.realOS = streamingOutput;
  }

  @Override

  public void write(OutputStream outputStream) throws IOException, WebApplicationException {
    byte[] response = retrieveResponse();

    byte[] snakeResponse = new JsonHelper(new NameMapper(){
      public String nameFor(String name) {
        return keyMap.containsKey(name) ? keyMap.get(name) : name;
      } ;
    }).changeFieldNames(response);

    outputStream.write(snakeResponse);
  }

  private byte[] retrieveResponse() throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    this.realOS.write(os);

    return os.toByteArray();
  }
}
