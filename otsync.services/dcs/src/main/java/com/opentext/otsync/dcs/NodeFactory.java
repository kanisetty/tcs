package com.opentext.otsync.dcs;

import com.opentext.otsync.rest.util.CSForwardHeaders;

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

    public CSNodeResource newCSNodeResource(String nodeID, HttpServletRequest request) {
        CSDocumentDownloader csDocumentDownloader = new CSDocumentDownloader(nodeID, new CSForwardHeaders(request));
        CSDocumentPageUploader csDocumentPageUploader = new CSDocumentPageUploader(nodeID, new CSForwardHeaders(request));

        return new CSNodeResource(nodeID, new CSRequestBuilderFactory(new CSForwardHeaders(request)), csDocumentDownloader, csDocumentPageUploader);
    }
}
