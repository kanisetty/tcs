package com.opentext.tempo.external.invites.persistence;

import com.opentext.tempo.external.invites.persistence.domain.NewInvitee;
import com.opentext.tempo.external.invites.persistence.domain.PasswordReset;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.Date;
import java.util.List;

import static org.fest.assertions.api.Assertions.assertThat;

@Ignore
@SuppressWarnings("JpaQlInspection")
public class EclipseLinkJpaHelperTest {

    private static final String CONNECTION_STRING = "jdbc:sqlserver://localhost:1433;databaseName=tempoinvitehandler";
    private static final String USER = "tempoInviteHandler";
    private static final String PASSWORD = "0P3nt3xt";
    private static final String DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";

    private EntityManager em;

    @Before
    public void setUp() throws Exception {
        EclipseLinkJpaHelper helper = new EclipseLinkJpaHelper(
                DatabaseConnectionManagerService.INVITE_HANDLER_PU_NAME);

        EntityManagerFactory emf = helper.getEMF(CONNECTION_STRING, USER, PASSWORD, DRIVER);
        em = emf.createEntityManager();

        dropInviteHandlerDb();
    }

    @After
    public void tearDown() throws Exception {
        dropInviteHandlerDb();
    }

    @Test
    public void testInviteEntitees() {
        List<NewInvitee> newInvitees = em.createNamedQuery(
                NewInvitee.FIND_ALL, NewInvitee.class)
                .getResultList();
        // there shouldn't be any invitees
        assertThat(newInvitees.isEmpty()).isTrue();

        Date validationDate = new Date();
        Date inviteDate = new Date();
        NewInvitee newInvitee = new NewInvitee("validationCode", "email",
                "firstName", "lastName", "inviterName", inviteDate, validationDate);

        em.getTransaction().begin();
        em.merge(newInvitee);
        em.getTransaction().commit();

        newInvitees = em.createNamedQuery(
                NewInvitee.FIND_ALL, NewInvitee.class)
                .getResultList();
        // there shouldn't be any invitees
        assertThat(newInvitees.size()).isEqualTo(1);

        List<PasswordReset> passwordResets = em.createNamedQuery(
                PasswordReset.FIND_ALL, PasswordReset.class)
                .getResultList();
        assertThat(passwordResets.isEmpty()).isTrue();

        PasswordReset passwordReset = new PasswordReset("validationCode", "username", validationDate);
        em.getTransaction().begin();
        em.merge(passwordReset);
        em.getTransaction().commit();

        passwordResets = em.createNamedQuery(
                PasswordReset.FIND_ALL, PasswordReset.class)
                .getResultList();
        assertThat(passwordResets.size()).isEqualTo(1);
    }

    private void dropInviteHandlerDb() {
        em.getTransaction().begin();
        em.createQuery("DELETE FROM NewInvitee nI").executeUpdate();
        em.createQuery("DELETE FROM PasswordReset pR").executeUpdate();
        em.getTransaction().commit();
    }

}