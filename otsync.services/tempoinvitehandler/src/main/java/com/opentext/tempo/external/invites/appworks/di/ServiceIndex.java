package com.opentext.tempo.external.invites.appworks.di;

import com.opentext.otag.sdk.client.v3.MailClient;
import com.opentext.otag.service.context.components.AWComponentContext;
import com.opentext.otag.service.context.error.AWComponentNotFoundException;
import com.opentext.tempo.external.invites.TempoInviteHandlerService;
import com.opentext.tempo.external.invites.api.ServiceNotReadyException;
import com.opentext.tempo.external.invites.email.EmailFromAddressHandler;
import com.opentext.tempo.external.invites.email.ExternalUserEmailClient;
import com.opentext.tempo.external.invites.handler.TempoInviteHandler;
import com.opentext.tempo.external.invites.persistence.DatabaseConnectionManager;
import com.opentext.tempo.external.invites.persistence.DatabaseConnectionManagerService;
import com.opentext.tempo.external.invites.persistence.TempoInviteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.opentext.otag.service.context.components.AWComponentContext.getComponent;

/**
 * Service locator that leverages the {@link AWComponentContext} to manage service
 * dependencies. We try to use constructor based "injection" for services to promote
 * easier unit testing of the service layer. We also expect certain components to be
 * auto-registered with the context, if they are not then we have not initialised
 * successfully, we should relay this to clients.
 */
public class ServiceIndex {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceIndex.class);

    private static final String SERVICE_INIT_FAILED = "The invite handler service is yet to connect to the database";
    private static final String SERVICE_NAME = "Tempo Invite Handler";

    public static String csUrl() {
        return getComponent(TempoInviteHandlerService.class).getCsConnection();
    }

    /**
     * Get the main service within the invite handler.
     *
     * @return invite handler service
     * @throws ServiceNotReadyException if our service configuration has not be
     *                                  initialised or AppWorks isn't ready
     */
    public static TempoInviteHandler tempoInviteHandler() throws ServiceNotReadyException {
        // use cached singleton if available
        TempoInviteHandler existingHandler = null;
        try {
            existingHandler = getComponent(TempoInviteHandler.class);
        } catch (AWComponentNotFoundException e) {
            if (LOG.isDebugEnabled())
                LOG.debug("TempoInviteHandler component was not registered yet");
        }

        if (existingHandler != null)
            return existingHandler;

        DatabaseConnectionManager connectionManager;
        try {
            connectionManager = getComponent(DatabaseConnectionManagerService.class);
        } catch (AWComponentNotFoundException e) {
            LOG.error("DatabaseConnectionManagerService was not auto-registered with AW context", e);
            throw new ServiceNotReadyException(SERVICE_INIT_FAILED);
        }

        if (connectionManager == null || !connectionManager.isConnected())
            throw new ServiceNotReadyException(SERVICE_INIT_FAILED);

        TempoInviteRepository inviteRepository = new TempoInviteRepository(connectionManager);
        TempoInviteHandler tempoInviteHandler = new TempoInviteHandler(externalUserEmailClient(), inviteRepository);

        // cache in component context
        LOG.info("Seeding TempoInviteHandler in AW context");
        AWComponentContext.add(tempoInviteHandler);
        return tempoInviteHandler;
    }

    /**
     * we store some of the SDK clients in here as our main service class is a
     * context listener so knows when its safe to create them.
     *
     * @param throwOnFail should an Exception be thrown if we fail to locate the service
     *
     * @return the AppWorks service instance
     */
    public static TempoInviteHandlerService tempoInviteHandlerService(boolean throwOnFail) {
        TempoInviteHandlerService component = getComponent(TempoInviteHandlerService.class);
        if ((component == null || !component.isReady()) && throwOnFail)
            throw new ServiceNotReadyException("The invite handlers AppWorks service is yet to start");
        return component;
    }

    private static ExternalUserEmailClient externalUserEmailClient() {
        try {
            return new ExternalUserEmailClient(new MailClient(), emailFromAddressHandler());
        } catch (Exception e) {
            throw new ServiceNotReadyException("Failed to create external email client", e);
        }
    }

    private static EmailFromAddressHandler emailFromAddressHandler() {
        return getComponent(EmailFromAddressHandler.class);
    }

}
