package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.cs.CSNodeResource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.core.StreamingOutput;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

public class Node {

    private static final Log LOG = LogFactory.getLog(Node.class);

    private String nodeId;

    private final NodePagesGenerator nodePagesGenerator;

    public Node(String nodeId) {
        if (isNullOrEmpty(nodeId))
            throw new IllegalArgumentException("A node must have an id");
        this.nodeId = nodeId;
        this.nodePagesGenerator = new NodePagesGenerator();
    }

    /**
     * Get the number of pages for a given node.
     *
     * @param csNodeResource CS HTTP client for a specific node
     * @return number of pages
     * @throws Exception if for some reason we aren't able to retrieve the number of pages
     */
    public synchronized int getTotalPages(CSNodeResource csNodeResource) throws Exception {
        if (LOG.isTraceEnabled())
            LOG.trace(Thread.currentThread().getName() + " started using getTotalPages for node " + nodeId);
        try {
            int pagesCount = csNodeResource.getPagesCount();
            if (pagesCount == 0) {
                nodePagesGenerator.generatePagesCount(csNodeResource);
                // ask CS again
                pagesCount = csNodeResource.getPagesCount();
            }

            return pagesCount;
        } finally {
            if (LOG.isTraceEnabled())
                LOG.trace(Thread.currentThread().getName() + " finished using getTotalPages for node " + nodeId);
        }
    }

    /**
     * Retrieve a specific page (image of) from a Content Server node resource (document).
     * <p>
     * The other public method of this class ({@link #getTotalPages(CSNodeResource)} should
     * have been used to determine if the supplied page number exists.
     *
     * @param page           the page number
     * @param csNodeResource CS HTTP client for a specific node
     * @return output stream containing the page bytes
     * @throws Exception if we cannot get the page data (image)
     */
    public synchronized StreamingOutput getPage(int page, CSNodeResource csNodeResource) throws Exception {
        if (LOG.isTraceEnabled())
            LOG.trace(Thread.currentThread().getName() + " started using getPage for node " +
                    nodeId + " page " + page);
        StreamingOutput streamOutput;
        try {
            streamOutput = null;
            try {
                streamOutput = csNodeResource.getPage(page);
            } catch (Exception e) {
                LOG.warn("Page " + page + " not found for node " + csNodeResource.getNodeID() +
                        " attempting to generate locally", e);
            }

            if (streamOutput == null) {
                if (LOG.isDebugEnabled())
                    LOG.debug("Page " + page + " was not found for csNodeResource, attempting to generate page");
                nodePagesGenerator.generatePage(csNodeResource, page);
                // ask CS again after we generated the page
                streamOutput = csNodeResource.getPage(page);
            }
        } finally {
            if (LOG.isDebugEnabled())
                LOG.trace(Thread.currentThread().getName() + " finished using getPage for node " +
                        nodeId + " page " + page);
        }

        return streamOutput;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Node node = (Node) o;

        return nodeId.equals(node.nodeId);
    }

    @Override
    public int hashCode() {
        return nodeId.hashCode();
    }

    @Override
    public String toString() {
        return "Node{" +
                "nodeId='" + nodeId + '\'' +
                ", nodePagesGenerator=" + nodePagesGenerator +
                '}';
    }

}
