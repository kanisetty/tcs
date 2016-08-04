package com.opentext.otsync.dcs.utils;

import com.opentext.otsync.dcs.appworks.ServiceIndex;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ContextListener implements ServletContextListener {

    private static final Log LOG = LogFactory.getLog(ContextListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        try {
            ServiceIndex.getFileCacheService().shutdown();
        } catch (Exception e) {
            LOG.error("Failed to shut down cache service gracefully", e);
        }

    }
}
