package com.opentext.tempo.external.invites.persistence;

import org.junit.Ignore;
import org.junit.Test;

@Ignore
public class InvitationIntegrationTest {

    @Test
    public void testInviteExternalUser() {
        InvitationHandlerClient testClient = new InvitationHandlerClient(
                "http://RHYSEDJNCQ72.opentext.net:8080");

        String trustedProviderKey = "f1a3847c-1f0b-4f38-a41e-6df49d864726";
        String email = "rhyse@opentext.com";

        // create the user in OTDS
        testClient.createExternalUserInOTDS(trustedProviderKey, email, "Livelink123!");

        // then invite them
        testClient.inviteExternalUser(trustedProviderKey,
                email, "Rhys", "Evans", "external",
                "test external invite handler folder", "", "en");
    }

}
