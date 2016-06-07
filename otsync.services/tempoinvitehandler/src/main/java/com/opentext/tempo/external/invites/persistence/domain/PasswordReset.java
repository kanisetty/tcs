package com.opentext.tempo.external.invites.persistence.domain;

import javax.persistence.*;
import java.util.Date;

@Entity
@NamedQueries({
        @NamedQuery(
                name = PasswordReset.FIND_ALL,
                query = "SELECT p FROM PasswordReset p"
        )
})
@SuppressWarnings("JpaQlInspection")
public class PasswordReset {

    public static final String FIND_ALL = "passwordReset.findAll";

    @Id
    private String validationCode;

    private String username;

    @Temporal(TemporalType.TIMESTAMP)
    private Date validationDate;

    public PasswordReset() {
    }

    public PasswordReset(String validationCode, String username, Date validationDate) {
        this.validationCode = validationCode;
        this.username = username;
        this.validationDate = validationDate;
    }

    public String getValidationCode() {
        return validationCode;
    }

    public void setValidationCode(String validationCode) {
        this.validationCode = validationCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getValidationDate() {
        return validationDate;
    }

    public void setValidationDate(Date validationDate) {
        this.validationDate = validationDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PasswordReset that = (PasswordReset) o;

        return validationCode != null ? validationCode.equals(that.validationCode) : that.validationCode == null;
    }

    @Override
    public int hashCode() {
        return validationCode != null ? validationCode.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "PasswordReset{" +
                "validationCode='" + validationCode + '\'' +
                ", username='" + username + '\'' +
                ", validationDate=" + validationDate +
                '}';
    }

}
