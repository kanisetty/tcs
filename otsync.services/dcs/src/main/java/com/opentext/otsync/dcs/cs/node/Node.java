package com.opentext.otsync.dcs.cs.node;

import com.opentext.otsync.dcs.cs.CSNodeResource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.core.StreamingOutput;

public class Node {

    private static final Log LOG = LogFactory.getLog(Node.class);

    private final NodePagesGenerator nodePagesGenerator;

    public Node() {
        this.nodePagesGenerator = new NodePagesGenerator();
    }

    public synchronized int getTotalPages(CSNodeResource csNodeResource) throws Exception {
        int pagesCount = csNodeResource.getPagesCount();
        if (pagesCount == 0) {
            nodePagesGenerator.generatePagesCount(csNodeResource);
            pagesCount = csNodeResource.getPagesCount();
        }

        return pagesCount;
    }

    public synchronized StreamingOutput getPage(int page, CSNodeResource csNodeResource) throws Exception {
        StreamingOutput streamOutput = csNodeResource.getPage(page);
        if (streamOutput == null) {
            if (LOG.isDebugEnabled())
                LOG.debug("Page " + page + " was not found for csNodeResource, generating page");
            nodePagesGenerator.generatePage(csNodeResource, page);
            streamOutput = csNodeResource.getPage(page);
        }

        return streamOutput;
    }
}
