package com.opentext.tempo.external.invites.persistence.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Entity
public class PasswordReset {

    @Id
    private String validationcode;

    private String username;

    @Temporal(TemporalType.TIMESTAMP)
    private Date validationdate;

    public PasswordReset() {
    }

    public PasswordReset(String validationcode, String username, Date validationdate) {
        this.validationcode = validationcode;
        this.username = username;
        this.validationdate = validationdate;
    }

    public String getValidationcode() {
        return validationcode;
    }

    public void setValidationcode(String validationcode) {
        this.validationcode = validationcode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getValidationdate() {
        return validationdate;
    }

    public void setValidationdate(Date validationdate) {
        this.validationdate = validationdate;
    }

}
