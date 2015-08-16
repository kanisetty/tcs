package com.opentext.otag.cs.dcs;

import com.opentext.otag.rest.util.ForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Map;

public class NodeFactory {
  private static NodeFactory instance;
  private Map<String, SoftReference<Node>> nodesCache = new HashMap<>();

  public static NodeFactory singleton() {
    if (instance == null) {
      synchronized (NodeFactory.class) {
        if (instance == null) {
          instance = new NodeFactory();
        }
      }
    }
    return instance;
  }

  public synchronized Node node(String nodeID) {
    SoftReference<Node> softReference = nodesCache.get(nodeID);
    if (softReference == null) {
      softReference = new SoftReference<>(new Node());
      nodesCache.put(nodeID, softReference);
    }

    return softReference.get();
  }

  public CSNodeResource newCSNodeResource(String nodeID, String csToken, HttpServletRequest request) {
    CSDocumentDownloader csDocumentDownloader = new CSDocumentDownloader(nodeID, csToken, new ForwardHeaders(request));
    CSDocumentPageUploader csDocumentPageUploader = new CSDocumentPageUploader(nodeID, csToken, new ForwardHeaders(request));

    return new CSNodeResource(nodeID, new CSRequestBuilderFactory(csToken, new ForwardHeaders(request)), csDocumentDownloader, csDocumentPageUploader);
  }
}
