package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.cs.CSDocumentDownloader;
import com.opentext.otsync.dcs.cs.CSDocumentPageUploader;
import com.opentext.otsync.dcs.cs.CSNodeResource;
import com.opentext.otsync.dcs.cs.CSRequestBuilderFactory;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import java.lang.ref.SoftReference;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NodeFactory {

    private static final Log LOG = LogFactory.getLog(NodeFactory.class);

    private static NodeFactory instance;

    /**
     * Memory-sensitive node cache, {@link SoftReference}s are used as they
     * wont be garbage collected until we are low on memory.
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

    public synchronized Node getOrCreateNode(String nodeID) {
        SoftReference<Node> softReference = nodesCache.get(nodeID);
        if (softReference == null) {
            if (LOG.isDebugEnabled())
                LOG.debug("Node " + nodeID + " was not found in cache, adding new Node");
            softReference = new SoftReference<>(new Node());
            nodesCache.put(nodeID, softReference);
        } else {
            if (LOG.isDebugEnabled())
                LOG.debug("Nnode " + nodeID + "was found in factory cache, returning");
        }

        return softReference.get();
    }

    public CSNodeResource createCSNodeResource(String nodeID, HttpServletRequest request) {
        CSDocumentDownloader docDownloader = new CSDocumentDownloader(nodeID, new CSForwardHeaders(request));
        CSDocumentPageUploader docPageUploader = new CSDocumentPageUploader(nodeID, new CSForwardHeaders(request));
        CSRequestBuilderFactory requestFactory = new CSRequestBuilderFactory(new CSForwardHeaders(request));

        return new CSNodeResource(nodeID, requestFactory, docDownloader, docPageUploader);
    }
}
