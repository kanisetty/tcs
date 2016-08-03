package com.opentext.otsync.dcs.appworks;

import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otsync.dcs.api.DCSApi;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public interface ContentServerURLProvider extends AWComponent {

    Log LOG = LogFactory.getLog(ContentServerURLProvider.class);

    String getContentServerUrl();

    static ContentServerURLProvider getProvider() {
        try {
            return AWComponentContext.getComponent(ContentServerURLProvider.class);
        } catch (Exception e) {
            LOG.error("We failed to retrieve the ContentServerURLProvider component???", e);
            throw new WebApplicationException(DCSApi.UNAVAILABLE_ERROR, Response.Status.SERVICE_UNAVAILABLE);
        }
    }

}
