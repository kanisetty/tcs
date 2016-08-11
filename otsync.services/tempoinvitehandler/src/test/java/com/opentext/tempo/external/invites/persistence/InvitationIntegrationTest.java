package com.opentext.tempo.external.invites.persistence;

import org.junit.Test;

public class InvitationIntegrationTest {

    @Test
    public void testInviteExternalUser() {
        InvitationHandlerClient testClient = new InvitationHandlerClient(
                "http://RHYSEDJNCQ72.opentext.net:8080");

        testClient.inviteExternalUser("f1a3847c-1f0b-4f38-a41e-6df49d864726",
                "rhyse@opentext.com", "Rhys", "Evans", "external",
                "test external invite handler folder", "", "en");
    }

}
