package com.opentext.tempo.external.invites.invitee.managment;

import com.opentext.otsync.otag.AWComponentRegistry;
import com.opentext.otsync.otag.components.HttpClientService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.tempo.external.invites.otds.OtdsService;
import com.opentext.tempo.external.invites.otds.OtdsServiceImpl;
import com.opentext.tempo.external.invites.otds.domain.OtdsUser;
import com.opentext.tempo.external.invites.persistence.DatabaseConnectionManagerService;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OtdsExternalUserAPI implements ExternalUserAPI {

    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConnectionManagerService.class);

    private final CSExternalUserAPI csService;

    public OtdsExternalUserAPI() {
        csService = new CSExternalUserAPI(HttpClientService.getService().getHttpClient());
    }

    public ExternalUserAPIResult inviteeValidated(String email, String password, String firstName,
                                                  String lastName, CSForwardHeaders headers) {
        try {
            OtdsUser result = getOTDSService().updateUser(firstName, lastName, email, password);
            if (result == null) {
                throw new RuntimeException("User may not have been created: " + email);
            }
        } catch (Throwable t) {
            LOG.error("Error setting invitee validated", t);
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR,
                    "Error during user creation: " + t.getLocalizedMessage());
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
        if (getOTDSService().findUserByEmail(email) == null) {
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, "no such user");
        }
        return new ExternalUserAPIResult();
    }

    public ExternalUserAPIResult sendPasswordUpdate(String email, String oldPwd,
                                                    String newPwd, CSForwardHeaders headers) {
        try {
            getOTDSService().updatePasswordbyEmail(email, oldPwd, newPwd);
        } catch (Throwable t) {
            if (LOG.isDebugEnabled()) {
                LOG.error("Error updating invitee password", t);
            }
            return new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.VALIDATION_ERROR, t.getLocalizedMessage());
        }

        return new ExternalUserAPIResult();
    }

    public OtdsService getOTDSService() {
        return AWComponentRegistry.getComponent(OtdsServiceImpl.class, "Tempo Invite Handler");
    }
}

