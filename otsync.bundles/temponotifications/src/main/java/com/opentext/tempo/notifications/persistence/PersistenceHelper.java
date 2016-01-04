package com.opentext.tempo.notifications.persistence;

import com.opentext.otag.api.PersistenceContext;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class PersistenceHelper {

    public static final String OTAG_PU_NAME = "OTAG";
    public static final String INVITE_HANDLER_PU_NAME = "tempoinvitehandler";

    public static EntityManager getTempoInviteEm() {
        return getEm(INVITE_HANDLER_PU_NAME);
    }

    public static EntityManager getGatewayEm() {
        return getEm(OTAG_PU_NAME);
    }

    private static EntityManager getEm(String puName) {
        EntityManagerFactory emf = PersistenceContext.getEntityManagerFactory(puName);
        return emf.createEntityManager();
    }

}
