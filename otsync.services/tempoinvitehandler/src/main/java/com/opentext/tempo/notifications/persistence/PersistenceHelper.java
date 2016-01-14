package com.opentext.tempo.notifications.persistence;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import com.opentext.otag.api.shared.util.AppWorksConfig;
import com.opentext.otag.api.shared.util.UrlPathUtil;
import com.opentext.otag.security.EncryptedProperties;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.spi.PersistenceUnitTransactionType;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

import static org.eclipse.persistence.config.PersistenceUnitProperties.*;

public class PersistenceHelper {

    public static final Log log = LogFactory.getLog(PersistenceHelper.class);

    public static final String INVITE_HANDLER_PU_NAME = "tempoinvitehandler";

    private static final String OPENTEXT_PROPERTIES_USERNAME = "com.opentext.db.username";
    private static final String OPENTEXT_PROPERTIES_PWORD = "com.opentext.db.password";
    private static final String OPENTEXT_PROPERTIES_DB_URL = "com.opentext.db.url";
    private static final String OPENTEXT_PROPERTIES_DRIVER = "com.opentext.db.driver";

    private static final String TOMCAT_BASE = System.getProperty("catalina.base");
    private static final String DB_ACCESS_PROPERTIES_BASE = TOMCAT_BASE + "/webApps/";
    private static final String DB_ACCESS_PROPS = "/dbAccess.properties";
    public static final String APP_KEY_HDR = "otagAppKey";

    private final EntityManagerFactory emf;
    private final Client restClient;

    public PersistenceHelper() {
        restClient = ClientBuilder.newClient().register(JacksonJsonProvider.class);
        EncryptedProperties dbProperties = getDbProperties();

        String connectionString = dbProperties.getProperty(OPENTEXT_PROPERTIES_DB_URL);
        String user = dbProperties.getProperty(OPENTEXT_PROPERTIES_USERNAME);
        String password = dbProperties.getProperty(OPENTEXT_PROPERTIES_PWORD);
        String jdbcDriver = dbProperties.getProperty(OPENTEXT_PROPERTIES_DRIVER);

        emf = getEMF(INVITE_HANDLER_PU_NAME, connectionString, user, password, jdbcDriver);
    }

    public EntityManager getEm() {
        return emf.createEntityManager();
    }

    /**
     * Get the database properties from our local deployment area. We request db
     * access via the Gateway if we haven't done so already.
     *
     * @return db values from encrypted properties file
     */
    private EncryptedProperties getDbProperties() {
        AppWorksConfig propsHelper = new AppWorksConfig();
        String appKey = propsHelper.getAppKey();
        String appName = propsHelper.getAppName();

        String dbAccessPath = DB_ACCESS_PROPERTIES_BASE + appName + DB_ACCESS_PROPS;

        EncryptedProperties dbAccessProps;
        if (Files.exists(Paths.get(dbAccessPath))) {
            dbAccessProps = loadDbAccessProps(appKey, dbAccessPath);
        } else {
            log.info("Requesting shared db access");
            String requestDbAccessUrl = propsHelper.getGatewayUrl() + "/deployments/manage/" + appName + "/grantDb";
            WebTarget target = restClient.target(UrlPathUtil.getBaseUrl(requestDbAccessUrl))
                    .path(UrlPathUtil.getPath(requestDbAccessUrl));

            try {
                Response response = target.request()
                        .header(APP_KEY_HDR, appKey)
                        .get();
                processResponse(response);
            } catch (Exception e) {
                throw new RuntimeException("Grant db access request failed", e);
            }

            // if successful the properties file should now be written
            if (!Files.exists(Paths.get(dbAccessPath)))
                throw new RuntimeException("Unable to read dbAccess file despite successful request returning???");

            dbAccessProps = loadDbAccessProps(appKey, dbAccessPath);
        }

        return dbAccessProps;
    }

    /**
     * Create an <code>EntityManagerFactory</code> using the supplied details.
     *
     * @param persistenceContextName name for our context (see persistence.xml)
     * @param connectionString       connection url
     * @param user                   user name
     * @param password               password
     * @param jdbcDriver             driver
     *
     * @return entity manager factory
     */
    private EntityManagerFactory getEMF(String persistenceContextName,
                                        String connectionString,
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

        try {
            return Persistence.createEntityManagerFactory(persistenceContextName, persistenceProperties);
        } catch (Exception e) {
            String msg = "Failed to create EMF, " + e.getMessage();
            log.error(msg, e);
            throw new RuntimeException(msg, e);
        }

    }

    private void processResponse(Response response) {
        if (response.getStatus() != 200) {
            String errMessage = "Grant db access was denied";
            logErrorRespBody(response, errMessage);
            throw new RuntimeException(errMessage);
        }
    }

    private void logErrorRespBody(Response response, String errMessage) {
        try {
            String errBody = response.readEntity(String.class);
            log.error(errBody);
        } catch (Exception e) {
            throw new RuntimeException(errMessage, e);
        }
    }

    private EncryptedProperties loadDbAccessProps(String appKey, String propsPath) {
        EncryptedProperties dbAccessProps = new EncryptedProperties(appKey);
        try (FileInputStream fis = new FileInputStream(propsPath)) {
            dbAccessProps.load(fis);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load dbAccess.properties file", e);
        }

        return dbAccessProps;
    }

}
