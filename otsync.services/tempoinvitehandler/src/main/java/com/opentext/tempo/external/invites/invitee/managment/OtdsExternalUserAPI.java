package com.opentext.tempo.external.invites.invitee.managment;

import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.util.StringUtil;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import com.opentext.tempo.external.invites.api.OtagInviteServlet;
import com.opentext.tempo.external.invites.otds.OtdsService;
import com.opentext.tempo.external.invites.otds.OtdsServiceImpl;
import com.opentext.tempo.external.invites.persistence.DatabaseConnectionManagerService;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * TODO FIXME - The operations this class was previously carrying out were not safe
 * TODO FIXME - this needs to be reimplemented with proper OTDS support from inside the service
 * TODO FIXME - these users are not AppWorks users, please isolate them in their own OTDS partition
 */
@Deprecated
public class OtdsExternalUserAPI implements ExternalUserAPI {

    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConnectionManagerService.class);

    private final CSExternalUserAPI csService;

    private OtdsService otdsService;

    private String otagUserPartition;
    private String otdsUrl;

    public OtdsExternalUserAPI() {
        // TODO FIXME RESOLVE SETTINGS FOR OTDS AUTH CONNECTION
        csService = new CSExternalUserAPI(new DefaultHttpClient());
        otdsService = new OtdsServiceImpl();
    }

    public ExternalUserAPIResult inviteeValidated(String email, String password, String firstName,
                                                  String lastName, CSForwardHeaders headers) {
        try {
            String externalUserName = toExternalUserName(email);
//
//            // tell the Gateway to use these new first and last name values for our external user
//            ProfileUpdate update = new ProfileUpdate();
//            update.setFirstName(firstName);
//            update.setLastName(lastName);
//
//            UpdateUserRequest editUserRequest = new UpdateUserRequest(externalUserName, password, update);
//
//            if (!authClient.editUser(editUserRequest)) {
//                return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
//                        "Request to edit user " + externalUserName + " has failed");
//            }
        } catch (Exception e) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
                    e.getLocalizedMessage());
        }
        return new ExternalUserAPIResult();
    }

    public ExternalUserAPIResult inviteeValidated(String email,
                                                  String existingEmail,
                                                  String existingPassword,
                                                  CSForwardHeaders headers) {
        // forward to CS to move the user's shares to the existing account
        return csService.inviteeValidated(email, existingEmail, existingPassword, headers);
    }

    public ExternalUserAPIResult userExist(String email, CSForwardHeaders headers) {

//        if (authClient.getUserProfie(toExternalUserName(email)) == null)
//            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, "no such user");
//
        return new ExternalUserAPIResult();
    }

    public ExternalUserAPIResult sendPasswordUpdate(String email, String oldPwd,
                                                    String newPwd, CSForwardHeaders headers) {
            throw new UnsupportedOperationException("NO LONGER SUPPORTED");
//        try {
//            String externalUserName = toExternalUserName(email);
//            PasswordUpdateRequest passwordUpdateRequest = new PasswordUpdateRequest(externalUserName, oldPwd, newPwd);
//            if (!authClient.updateUserPassword(passwordUpdateRequest)) {
//                return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
//                        "Password update for user " + externalUserName + "has failed");
//            }
//        } catch (Exception e) {
//            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, e.getLocalizedMessage());
//        }
//
//        return new ExternalUserAPIResult();
    }

    private String toExternalUserName(String email) {
        return email + "@" + otagUserPartition;
    }
}

