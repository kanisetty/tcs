package com.opentext.otsync.shares.request;

import com.opentext.otag.api.CSRequest;
import com.opentext.otsync.shares.rest.SharesService;
import com.opentext.otsync.shares.rest.SharesService;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import com.opentext.otag.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CSShareRequestBuilder {

  public static final String OTSYNC_OTSYNCREQUEST = "otsync.otsyncrequest";
  private String subType;
  private HttpServletRequest request;
  private Map<String, Object> info;


  public CSShareRequestBuilder subType(String subType) {
    this.subType = subType;
    return this;
  }

  public CSShareRequestBuilder request(HttpServletRequest request) {
    this.request = request;
    return this;
  }

  public CSShareRequestBuilder info(Map<String, Object> info) {
    this.info = info;
    return this;
  }

  public StreamingOutput build() {

    Payload payload = new Payload().subType(subType);
    if (info!= null) payload.info(info);

    List<NameValuePair> params = new ArrayList<NameValuePair>(1);
    params.add(new BasicNameValuePair("payload", payload.toJson()));

    return new SnakeResponseAdapter(new CSRequest(SharesService.getCsUrl(), OTSYNC_OTSYNCREQUEST, params, new CSForwardHeaders(request)));
  }
}
