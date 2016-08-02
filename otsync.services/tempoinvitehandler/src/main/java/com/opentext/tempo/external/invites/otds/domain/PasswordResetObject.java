package com.opentext.tempo.external.invites.otds.domain;

import java.io.Serializable;

public class PasswordResetObject implements Serializable {

    private final String oldPassword;
    private final String newPassword;

    public PasswordResetObject(String newPassword) {
        this(null, newPassword);
    }

    public PasswordResetObject(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PasswordResetObject that = (PasswordResetObject) o;

        if (oldPassword != null ? !oldPassword.equals(that.oldPassword) : that.oldPassword != null) return false;
        return newPassword != null ? newPassword.equals(that.newPassword) : that.newPassword == null;

    }

    @Override
    public int hashCode() {
        int result = oldPassword != null ? oldPassword.hashCode() : 0;
        result = 31 * result + (newPassword != null ? newPassword.hashCode() : 0);
        return result;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    @Override
    public final String toString() {
        return super.toString(); // don't echo passwords
    }
}
