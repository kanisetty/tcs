package com.opentext.tempo.external.invites.persistence.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Entity
public class NewInvitee {

    @Id
    private String validationcode;

    private String email;

    private String firstname;

    private String lastname;

    private String invitername;

    @Temporal(TemporalType.TIMESTAMP)
    private Date invitedate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date validationdate;

    public NewInvitee() {
    }

    public NewInvitee(String validationcode, String email, String firstname, String lastname,
                      String invitername, Date invitedate, Date validationdate) {
        this.validationcode = validationcode;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.invitername = invitername;
        this.invitedate = invitedate;
        this.validationdate = validationdate;
    }

    public String getValidationcode() {
        return validationcode;
    }

    public void setValidationcode(String validationcode) {
        this.validationcode = validationcode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getInvitername() {
        return invitername;
    }

    public void setInvitername(String invitername) {
        this.invitername = invitername;
    }

    public Date getInvitedate() {
        return invitedate;
    }

    public void setInvitedate(Date invitedate) {
        this.invitedate = invitedate;
    }

    public Date getValidationdate() {
        return validationdate;
    }

    public void setValidationdate(Date validationdate) {
        this.validationdate = validationdate;
    }

}
