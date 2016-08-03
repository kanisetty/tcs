package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.cs.CSDocumentDownloader;
import com.opentext.otsync.dcs.cs.CSDocumentPageUploader;
import com.opentext.otsync.dcs.cs.CSNodeResource;
import com.opentext.otsync.dcs.cs.CSRequestBuilderFactory;
import com.opentext.otsync.rest.util.CSForwardHeaders;

import javax.servlet.http.HttpServletRequest;
import java.lang.ref.SoftReference;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NodeFactory {

    private static NodeFactory instance;

    /**
     * Soft references are retained until pressure of available memory is received, they
     * generally wont be GC'd until its deemed absolutely necessary. This is therefore a
     * memory-sensitive cache.
     */
    private Map<String, SoftReference<Node>> nodesCache = new ConcurrentHashMap<>();

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
        CSDocumentDownloader docDownloader =
                new CSDocumentDownloader(nodeID, new CSForwardHeaders(request));

        CSDocumentPageUploader docPageUploader =
                new CSDocumentPageUploader(nodeID, new CSForwardHeaders(request));

        CSRequestBuilderFactory requestFactory =
                new CSRequestBuilderFactory(new CSForwardHeaders(request));

        return new CSNodeResource(nodeID, requestFactory, docDownloader, docPageUploader);
    }
}
