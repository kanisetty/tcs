package com.opentext.otag.cluster.poc;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Hook into the Servlet life-cycle to listen to app events from the managing Gateway service.
 */
@WebListener
public class AppWorksService implements ServletContextListener {

    public static final Log LOG = LogFactory.getLog(AppWorksService.class);

    public static final String LOG_MARKER = "***** CLUSTER POC ****** - ";

    private static Thread senderThread = null;
    private static Cluster cluster = Cluster.getInstance();

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // on deploy of the context
        LOG.info(LOG_MARKER + "Cluster POC service started");

        // setup a cluster and start listening
        cluster.start();

        // continually ping everyone else
        Thread senderThread = new Thread(() -> {
            int count = 0;
            while (true) {
                try {
                    cluster.send(new ClusterMessage("Message-" + count));
                    Thread.sleep(10 * 1000);
                } catch (Exception e) {
                    LOG.error("Test send failed " + e.getMessage(), e);
                }
                count++;
            }
        });
        senderThread.start();

        LOG.info(LOG_MARKER + "Cluster POCService contextInitialized successfully");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        try {
            LOG.info("Stopping sender thread");
            if (senderThread != null)
                senderThread.interrupt();
        } catch (Exception e) {
            LOG.error("Failed to stop sender thread gracefully, " + e.getMessage(), e);
        }

        try {
            cluster.stop();
        } catch (Exception e) {
            LOG.error("Failed to shutdown cluster gracefully, " + e.getMessage(), e);
        }
        // the web app really has been undeployed at this point
        LOG.info(LOG_MARKER + "Cluster POC service stopped");
    }

}
