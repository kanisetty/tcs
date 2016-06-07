package com.opentext.tempo.external.invites.persistence;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.spi.PersistenceUnitTransactionType;
import java.util.Properties;

import static org.eclipse.persistence.config.PersistenceUnitProperties.*;

public class EclipseLinkJpaHelper {

    /**
     * Name for the persistence unit (see persistence.xml)
     */
    private final String persistenceUnit;

    public EclipseLinkJpaHelper(String puName) {
        this.persistenceUnit = puName;
    }

    /**
     * Create an {@link EntityManagerFactory} using the supplied details.
     *
     * @param connectionString       connection url
     * @param user                   user name
     * @param password               password
     * @param jdbcDriver             driver
     * @return entity manager factory
     */
    public EntityManagerFactory getEMF(String connectionString,
                                              String user,
                                              String password,
                                              String jdbcDriver) {
        Properties persistenceProperties = new Properties();

        persistenceProperties.put(TRANSACTION_TYPE, PersistenceUnitTransactionType.RESOURCE_LOCAL.name());
        // log only errors, since eclipselink otherwise logs a bunch of ordinary behaviour as 'warning's
        persistenceProperties.put(LOGGING_LEVEL, "FINE");
        // this puts eclipselink logging in the catalina log
        persistenceProperties.put(LOGGING_LOGGER, "JavaLogger");
        // This setting will automatically create any missing tables and add any missing columns.
        // Any more complicated migrations will need to be handled in another way.
        persistenceProperties.put(DDL_GENERATION, CREATE_OR_EXTEND);

        persistenceProperties.put(JDBC_URL, connectionString);
        persistenceProperties.put(JDBC_DRIVER, jdbcDriver);
        persistenceProperties.put(JDBC_USER, user);
        persistenceProperties.put(JDBC_PASSWORD, password);

        persistenceProperties.put(CONNECTION_POOL + CONNECTION_POOL_MAX, "5");

        return Persistence.createEntityManagerFactory(persistenceUnit, persistenceProperties);
    }

}
