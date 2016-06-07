package com.opentext.tempo.external.invites.api;

import com.opentext.otag.sdk.client.v3.TrustedProviderClient;
import com.opentext.otag.sdk.types.v3.TrustedProvider;
import com.opentext.otag.sdk.types.v3.TrustedProviders;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.annotations.PrivateApi;
import com.opentext.tempo.external.invites.appworks.di.ServiceIndex;
import com.opentext.tempo.external.invites.handler.TempoInviteHandler;
import com.opentext.tempo.external.invites.invitee.managment.ExternalUserAPIResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("invitations")
@PrivateApi
public class InvitationsResource {

    private final static Logger LOG = LoggerFactory.getLogger(InvitationsResource.class);

    @POST
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

            // Check the sender's trusted provider key
            TrustedProviderClient client = new TrustedProviderClient();
            TrustedProvider provider = null;
            TrustedProviders allProviders = client.getAllProviders();
            for (TrustedProvider trustedProvider : allProviders.getTrustedProviders()) {
                if (key.equals(trustedProvider.getKey())) {
                    provider = trustedProvider;
                }
            }

            if (provider == null) {
                LOG.warn("Someone POST-ed to invitations with an invalid provider key: " + key);
                return Response.status(Response.Status.FORBIDDEN).build();
            }

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

}
