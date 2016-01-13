package com.opentext.tempo.notifications.api;

import com.opentext.otag.api.shared.types.TrustedProvider;
import com.opentext.otag.sdk.client.TrustedProviderClient;
import com.opentext.otsync.annotations.PrivateApi;
import com.opentext.tempo.notifications.TempoInviteHandler;
import com.opentext.tempo.notifications.api.auth.ExternalUserAPIResult;
import org.apache.log4j.Logger;

import javax.servlet.ServletContext;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("invitations")
@PrivateApi
public class InvitationsResource {

    private final static Logger LOG = Logger.getLogger(InvitationsResource.class);

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

        // Check the sender's trusted provider key
        TrustedProviderClient client = new TrustedProviderClient();
        TrustedProvider provider = null;
        List<TrustedProvider> allProviders = client.getAllProviders();
        for (TrustedProvider trustedProvider : allProviders) {
            if (key.equals(trustedProvider.getKey())) {
                provider = trustedProvider;
            }
        }

        if (provider == null) {
            LOG.warn("Someone POST-ed to invitations with an invalid provider key: " + key);
            return Response.status(Response.Status.FORBIDDEN).build();
        }
		
        ExternalUserAPIResult result = TempoInviteHandler.handleSendInvitationAction(
                servletContext, email, firstName, lastName, lang, folderName, folderDesc, extraInfo);

        if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
            LOG.error(result.errMsg);
            return Response.serverError().build();
        }

        return Response.ok().build();
    }

}
