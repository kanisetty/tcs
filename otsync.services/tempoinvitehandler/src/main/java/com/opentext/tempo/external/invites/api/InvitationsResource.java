package com.opentext.tempo.external.invites.api;

import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otag.sdk.types.v3.TrustedProviders;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.annotations.PrivateApi;
import com.opentext.otsync.otag.AWComponentRegistry;
import com.opentext.tempo.external.invites.appworks.di.ServiceIndex;
import com.opentext.tempo.external.invites.handler.TempoInviteHandler;
import com.opentext.tempo.external.invites.invitee.managment.ExternalUserAPIResult;
import com.opentext.tempo.external.invites.otds.OtdsService;
import com.opentext.tempo.external.invites.otds.OtdsServiceImpl;
import com.opentext.tempo.external.invites.otds.domain.OtdsUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("invitations")
@PrivateApi
public class InvitationsResource {

    private final static Logger LOG = LoggerFactory.getLogger(InvitationsResource.class);

    /**
     * Create a user in the external user partition we have setup in OTDS.
     *
     * @param key      CS trusted provider key
     * @param email    new user email
     * @param password new user password
     * @return the created OTDS user
     */
    @POST
    @Path("create")
    public Response createExternalUserInOtds(@FormParam("key") String key,
                                             @FormParam("email") String email,
                                             @FormParam("password") String password) {
        try {
            TempoInviteHandler handler = ServiceIndex.tempoInviteHandler();
            if (!validateProviderAccess(key))
                return Response.status(Response.Status.FORBIDDEN).build();

            // create the user via OTDS, if we are not using OTDS then balk as
            // CS should be handling non-OTDS user creation directly
            if (!handler.isUsingOTDS())
                throw new WebApplicationException("Cannot create new external user in OTDS " +
                        "as this instance of the invite handler is not using OTDS for " +
                        "user management", Response.Status.BAD_REQUEST);

            OtdsService otdsService = AWComponentRegistry.getComponent(OtdsServiceImpl.class, "Tempo Invite Handler");

            try {
                // we don't supply the first and last name as they are setup when the external user
                // confirms them after being sent the email
                OtdsUser otdsUser = otdsService.createExternalUser("", "", email, password);
                return Response.ok(otdsUser).build();
            } catch (Exception e) {
                String errMsg = "We failed to create the new external user in OTDS";
                LOG.error(errMsg, e);
                throw new WebApplicationException(errMsg);
            }
        } catch (APIException e) {
            LOG.error("Gateway API call failed - " + e.getCallInfo());
            return Response.serverError().build();
        } catch (ServiceNotReadyException e) {
            LOG.error("Service was not able to service the request yet - {}", e.getMessage());
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
    }

    /**
     * Invite an external user using a trusted provider client.
     *
     * @param servletContext servlet context
     * @param key            trusted provider key
     * @param email          invitee email address
     * @param firstName      invitee first name
     * @param lastName       invitee last name
     * @param folderName     folder name
     * @param folderDesc     folder description
     * @param extraInfo      extra invitee info
     * @param lang           language
     * @return 200 OK if the invite succeeds
     */
    @POST // use x-www-form-urlencoded with this endpoint
    public Response inviteExternalUser(@Context ServletContext servletContext,
                                       @FormParam("key") String key,
                                       @FormParam("email") String email,
                                       @FormParam("firstName") String firstName,
                                       @FormParam("lastName") String lastName,
                                       @FormParam("folderName") String folderName,
                                       @FormParam("folderDesc") String folderDesc,
                                       @FormParam("extraInfo") String extraInfo,
                                       @FormParam("lang") String lang) {

        try {
            // attempt to load the service ASAP to determine if the service is ready to handle
            // requests yet
            TempoInviteHandler handler = ServiceIndex.tempoInviteHandler();
            if (!validateProviderAccess(key))
                return Response.status(Response.Status.FORBIDDEN).build();


            ExternalUserAPIResult result = handler.handleSendInvitationAction(
                    servletContext, email, firstName, lastName, lang, folderName, folderDesc, extraInfo);

            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                LOG.error(result.errMsg);
                return Response.serverError().build();
            }

            return Response.ok().build();
        } catch (APIException e) {
            LOG.error("Gateway API call failed - " + e.getCallInfo());
            return Response.serverError().build();
        } catch (ServiceNotReadyException e) {
            LOG.error("Service was not able to service the request yet - {}", e.getMessage());
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }
    }

    private boolean validateProviderAccess(@FormParam("key") String key) {
        try {
            // Check the sender's trusted provider key
            TrustedProviderClient client = new TrustedProviderClient();
            TrustedProviders allProviders = client.getAllProviders();
            // does the Gateway know the supplied key?
            for (TrustedProvider trustedProvider : allProviders.getTrustedProviders()) {
                if (key.equals(trustedProvider.getKey())) {
                    return true;
                }
            }

            if (LOG.isDebugEnabled())
                LOG.debug("No provider found with supplied key");

            return false;
        } catch (Exception e) {
            LOG.error("Failed to validate supplied trusted provider key", e);
            return false;
        }
    }

}
