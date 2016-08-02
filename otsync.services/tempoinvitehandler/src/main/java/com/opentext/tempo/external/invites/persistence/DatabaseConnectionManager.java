package com.opentext.tempo.external.invites.persistence;

import javax.persistence.EntityManager;
import java.util.Optional;

public interface DatabaseConnectionManager {

    Optional<EntityManager> getEm();

    boolean isConnected();

}
