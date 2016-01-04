package com.opentext.tempo.notifications.api.auth;

import com.opentext.otag.api.HttpClient;
import com.opentext.otag.auth.NewUserProfile;
import com.opentext.otag.auth.OtdsIdentityService;
import com.opentext.otag.auth.OtdsUserProfile;
import com.opentext.otag.rest.util.ForwardHeaders;
import com.opentext.otds.OtdsException;

import javax.ws.rs.WebApplicationException;
import java.io.IOException;

public class OtdsExternalUserAPI implements ExternalUserAPI {

    private final OtdsIdentityService service;
    private final CSExternalUserAPI csService;

    public OtdsExternalUserAPI(OtdsIdentityService otdsIdentityService) {
        service = otdsIdentityService;
        csService = new CSExternalUserAPI(new HttpClient());
    }

    public ExternalUserAPIResult inviteeValidated(String email, String password, String firstName, 
                                                  String lastName, ForwardHeaders headers) {
        try {
            OtdsUserProfile currentProfile = new OtdsUserProfile(service, email + '@' + service.getOtagUserPartition());
            NewUserProfile newProfile = new NewUserProfile(currentProfile);

            newProfile.setFirstName(firstName);
            newProfile.setLastName(lastName);

            service.edit(newProfile, password);

        } catch (WebApplicationException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
                    e.getResponse().getEntity().toString());
        } catch (OtdsException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
                    e.getLocalizedMessage());
        } catch (IOException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.IOERROR,
                    e.getLocalizedMessage());
        }
        return new ExternalUserAPIResult();
    }

    public ExternalUserAPIResult inviteeValidated(String email,
                                                  String existingEmail,
                                                  String existingPassword,
                                                  ForwardHeaders headers) {
        // forward to CS to move the user's shares to the existing account
        return csService.inviteeValidated(email, existingEmail, existingPassword, headers);
    }

    public ExternalUserAPIResult userExist(String username, ForwardHeaders headers) {
        try {
            service.getClient().getUser(username + '@' + service.getOtagUserPartition());
        } catch (OtdsException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, "no such user");
        }
        return new ExternalUserAPIResult();
    }

    public ExternalUserAPIResult sendPasswordUpdate(String email, String oldPwd,
                                                    String newPwd, ForwardHeaders headers) {
        try {
            if (oldPwd == null){
                service.getAdminClient().resetPasswordByAdministrator(email + '@' + service.getOtagUserPartition(), newPwd);
            } else{
                service.getClient().resetPassword(email + '@' + service.getOtagUserPartition(), newPwd, oldPwd);
            }
        } catch (OtdsException e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, e.getLocalizedMessage());
        }
        return new ExternalUserAPIResult();
    }

}

