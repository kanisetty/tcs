package com.opentext.tempo.external.invites.otds;

import com.opentext.tempo.external.invites.otds.domain.OtdsUser;

public interface OtdsService {
    OtdsUser createUser(String firstName, String lastName, String email, String password);

    OtdsUser updateUser(String firstName, String lastName, String email, String password);

    OtdsUser findUser(String userId);

    OtdsUser getUser(String userId);

    OtdsUser findUserByEmail(String email);

    OtdsUser getUserByEmail(String email);

    void updatePassword(String userId, String existingPassword, String newPassword);

    void updatePasswordbyEmail(String email, String existingPassword, String newPassword);

    void resetPassword(String userId, String newPassword);

    void resetPasswordByEmail(String email, String newPassword);
}
