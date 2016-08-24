package com.opentext.otsync.otag;

import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otag.service.context.error.AWComponentNotFoundException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.Objects;

/**
 * Wrapper for {@link AWComponentContext} access from our services. In general if the
 * seeding of the component context failed then the service should be considered unavailable.
 */
public class AWComponentRegistry {

    private static final Log LOG = LogFactory.getLog(AWComponentRegistry.class);

    private static final String UNAVAILABLE_ERROR = "%s is yet to be initialised";


    public static <T extends AWComponent> T getComponent(Class<T> type, String serviceName) {
        Objects.requireNonNull(type, "Can only get non-null components");
        try {
            return AWComponentContext.getComponent(type);
        } catch (AWComponentNotFoundException e) {
            LOG.error("Failed to resolve " + type.getName() + " component???", e);
            throw serviceNotSetupEx(serviceName);
        }
    }

    private static WebApplicationException serviceNotSetupEx(String serviceName) {
        return new WebApplicationException(String.format(UNAVAILABLE_ERROR, serviceName),
                Response.Status.SERVICE_UNAVAILABLE);
    }

}
