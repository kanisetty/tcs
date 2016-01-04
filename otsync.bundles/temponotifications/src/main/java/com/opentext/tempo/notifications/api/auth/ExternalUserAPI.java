package com.opentext.tempo.notifications.api.auth;

import com.opentext.otag.rest.util.ForwardHeaders;

/**
 * External user authentication API. We use CS or OTDS based authentication based
 * on what the Gateway tells us it is using via its IdentityServiceProvider.
 */
public interface ExternalUserAPI {

    /**
     * Activate the user identified by the given email.
     */
    ExternalUserAPIResult inviteeValidated(String email,
                                           String password,
                                           String firstName,
                                           String lastName,
                                           ForwardHeaders headers);

    /**
     * Don't activate the given email; instead, merge it with an existing account.
     */
    ExternalUserAPIResult inviteeValidated(String email,
                                           String existingEmail,
                                           String existingPassword,
                                           ForwardHeaders headers);

    /**
     * Return a success if the user exists.
     */
    ExternalUserAPIResult userExist(String username, ForwardHeaders headers);

    /**
     * Reset the user's password.
     */
    ExternalUserAPIResult sendPasswordUpdate(String email,
                                             String oldPwd,
                                             String newPwd,
                                             ForwardHeaders headers);

}
