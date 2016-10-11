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

    /**
     * Get the number of pages for a given node.
     *
     * @param csNodeResource CS HTTP client for a specific node
     * @return number of pages
     * @throws Exception if for some reason we aren't able to retrieve the number of pages
     */
    public int getTotalPages(CSNodeResource csNodeResource) throws Exception {
        int pagesCount = csNodeResource.getPagesCount();
        if (pagesCount == 0) {
            nodePagesGenerator.generatePagesCount(csNodeResource);
            // ask CS again
            pagesCount = csNodeResource.getPagesCount();
        }

        return pagesCount;
    }

    /**
     * Retrieve a specific page (image of) from a Content Server node resource (document).
     * The other public method of this class ({@link #getTotalPages(CSNodeResource)} should
     * have been used to determine if the supplied page number exists.
     *
     * @param page           the page number
     * @param csNodeResource CS HTTP client for a specific node
     * @return output stream containing the page bytes
     * @throws Exception if we cannot get the page data (image)
     */
    public StreamingOutput getPage(int page, CSNodeResource csNodeResource) throws Exception {
        StreamingOutput streamOutput = csNodeResource.getPage(page);
        if (streamOutput == null) {
            if (LOG.isDebugEnabled())
                LOG.debug("Page " + page + " was not found for csNodeResource, attempting to generate page");
            nodePagesGenerator.generatePage(csNodeResource, page);
            // ask CS again
            streamOutput = csNodeResource.getPage(page);
        }

        return streamOutput;
    }

}
