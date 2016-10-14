package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.appworks.SettingsService;
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

    private static volatile NodeFactory instance;

    /**
     * We keep objects that represent CS nodes so we can lock concurrent operations on
     * those nodes, as the conversion processes implemented in this service can be expensive
     * and only need to be executed once (per version of the node).
     *
     * @see SettingsService#TMP_CLEANUP_TIMEOUT_KEY
     */
    private final Map<String, SoftReference<Node>> nodesCache = new ConcurrentHashMap<>();

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
            softReference = addNodeReference(nodeID);
        } else {
            if (softReference.get() == null) {
                if (LOG.isDebugEnabled())
                    LOG.debug("Cached Node reference to " + nodeID +
                            "was GC'ed, replacing in cache as it has been requested again");
                softReference = addNodeReference(nodeID);
            } else {
                if (LOG.isTraceEnabled())
                    LOG.trace("Node " + nodeID + "was found in factory cache, returning");
            }
        }

        return softReference.get();
    }

    public CSNodeResource createCSNodeResource(String nodeID, HttpServletRequest request) {
        CSDocumentDownloader docDownloader = new CSDocumentDownloader(nodeID, new CSForwardHeaders(request));
        CSDocumentPageUploader docPageUploader = new CSDocumentPageUploader(nodeID, new CSForwardHeaders(request));
        CSRequestBuilderFactory requestFactory = new CSRequestBuilderFactory(new CSForwardHeaders(request));

        return new CSNodeResource(nodeID, requestFactory, docDownloader, docPageUploader);
    }

    private SoftReference<Node> addNodeReference(String nodeID) {
        SoftReference<Node> softReference = new SoftReference<>(new Node(nodeID));
        nodesCache.put(nodeID, softReference);
        return softReference;
    }

}
