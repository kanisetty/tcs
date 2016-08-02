package com.opentext.tempo.external.invites.persistence.domain;

import javax.persistence.*;
import java.util.Date;

@Entity
@NamedQueries({
        @NamedQuery(
                name = NewInvitee.FIND_ALL,
                query = "SELECT nI FROM NewInvitee nI"
        )
})
@SuppressWarnings("JpaQlInspection")
public class NewInvitee {

    public static final String FIND_ALL = "newInvitee.findAll";

    @Id
    private String validationCode;

    private String email;

    private String firstName;

    private String lastname;

    private String inviterName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date inviteDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date validationDate;

    public NewInvitee() {
    }

    public NewInvitee(String validationCode, String email, String firstName, String lastName,
                      String inviterName, Date inviteDate, Date validationDate) {
        this.validationCode = validationCode;
        this.email = email;
        this.firstName = firstName;
        this.lastname = lastName;
        this.inviterName = inviterName;
        this.inviteDate = inviteDate;
        this.validationDate = validationDate;
    }

    public String getValidationCode() {
        return validationCode;
    }

    public void setValidationCode(String validationCode) {
        this.validationCode = validationCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getInviterName() {
        return inviterName;
    }

    public void setInviterName(String inviterName) {
        this.inviterName = inviterName;
    }

    public Date getInviteDate() {
        return inviteDate;
    }

    public void setInviteDate(Date inviteDate) {
        this.inviteDate = inviteDate;
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

        NewInvitee that = (NewInvitee) o;

        return validationCode != null ? validationCode.equals(that.validationCode) : that.validationCode == null;
    }

    @Override
    public int hashCode() {
        return validationCode != null ? validationCode.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "NewInvitee{" +
                "validationCode='" + validationCode + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastname='" + lastname + '\'' +
                ", inviterName='" + inviterName + '\'' +
                ", inviteDate=" + inviteDate +
                ", validationDate=" + validationDate +
                '}';
    }

}
