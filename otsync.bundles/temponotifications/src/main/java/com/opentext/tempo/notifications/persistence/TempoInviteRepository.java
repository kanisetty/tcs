package com.opentext.tempo.notifications.persistence;

import com.opentext.tempo.notifications.persistence.domain.NewInvitee;
import com.opentext.tempo.notifications.persistence.domain.PasswordReset;

import javax.persistence.EntityManager;
import java.sql.SQLException;
import java.util.Date;
import java.util.UUID;

public class TempoInviteRepository {

    public NewInvitee loadInviteeFromToken(String token) throws SQLException {
        return getEm().find(NewInvitee.class, token);
    }

    public PasswordReset loadPasswordResetFromToken(String token) throws SQLException {
        return getEm().find(PasswordReset.class, token);
    }

    public void validateInvitee(String token, String firstname, String lastname) throws SQLException {
        EntityManager manager = getEm();
        manager.getTransaction().begin();

        NewInvitee invitee = manager.find(NewInvitee.class, token);
        if (invitee != null) {
            invitee.setFirstname(firstname);
            invitee.setLastname(lastname);
            invitee.setValidationdate(new Date());

            manager.merge(invitee);
        }

        manager.getTransaction().commit();
    }

    public void validatePasswordReset(String token) throws SQLException {
        EntityManager manager = getEm();
        manager.getTransaction().begin();

        PasswordReset reset = manager.find(PasswordReset.class, token);
        if (reset != null) {
            reset.setValidationdate(new Date());

            manager.merge(reset);
        }

        manager.getTransaction().commit();
    }

    /*
     * Returns the validation token for the given invitee.
     */
    public String addNewInvitee(String email, String invitername) throws SQLException {
        EntityManager manager = getEm();
        manager.getTransaction().begin();

        NewInvitee invitee = new NewInvitee();
        invitee.setEmail(email);
        invitee.setInvitername(invitername);
        invitee.setInvitedate(new Date());
        invitee.setValidationcode(generateUUID());

        manager.persist(invitee);

        manager.getTransaction().commit();

        return invitee.getValidationcode();
    }

    /*
     * Returns the validation token for the given user.
     */
    public String addPasswordReset(String username) throws SQLException {
        EntityManager manager = getEm();
        manager.getTransaction().begin();

        PasswordReset reset = new PasswordReset();
        reset.setUsername(username);
        reset.setValidationcode(generateUUID());

        manager.persist(reset);

        manager.getTransaction().commit();

        return reset.getValidationcode();
    }

    private String generateUUID() {
        return UUID.randomUUID().toString();
    }

    private EntityManager getEm() {
        return PersistenceHelper.getTempoInviteEm();
    }

}

