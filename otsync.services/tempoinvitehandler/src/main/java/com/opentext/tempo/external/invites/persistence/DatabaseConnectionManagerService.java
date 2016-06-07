package com.opentext.tempo.external.invites.persistence;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

/**
 * Listener that takes care of the database connection creation for this service.
 * AppWorks settings are used to manage these details. We use EclipseLink as our
 * JPA provider, and manage our own transactions.
 */
public class DatabaseConnectionManagerService
        extends AbstractMultiSettingChangeHandler /* AppWorks setting handling */
        implements AWServiceContextHandler, /* AppWorks startup handler, so we can resolve settings */
        DatabaseConnectionManager {

    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConnectionManagerService.class);

    /**
     * Invite handler persistence unit name (see persistence.xml).
     */
    private static final String INVITE_HANDLER_PU_NAME = "tempoinvitehandler";

    private final EclipseLinkJpaHelper jpaHelper;
    private EntityManagerFactory emf;

    // properties required to create a connection
    private String username;
    private String password;
    private String jdbcUrl;
    private String jdbcDriver;


    public DatabaseConnectionManagerService() {
        jpaHelper = new EclipseLinkJpaHelper(INVITE_HANDLER_PU_NAME);

        // handle settings updates
        addHandler(InviteHandlerConstants.USER_NAME, settingsChangeMessage -> {
            username = settingsChangeMessage.getNewValue();
            updateEmf();
        });
        addHandler(InviteHandlerConstants.PASSWORD, settingsChangeMessage -> {
            password = settingsChangeMessage.getNewValue();
            updateEmf();
        });
        addHandler(InviteHandlerConstants.JDBC_URL, settingsChangeMessage -> {
            String urlValue = settingsChangeMessage.getNewValue();
            if (resolveDriver(urlValue)) {
                jdbcUrl = urlValue;
            }
            updateEmf();
        });
    }

    @Override
    public void onStart(String appName) {
        LOG.info("DatabaseConnectionManagerService#onStart");

        // attempt to resolve our settings now it is safe to instantiate SDK clients
        SettingsClient settingsClient = new SettingsClient();

        getSettingKeys().forEach(key -> {
            switch (key) {
                case InviteHandlerConstants.USER_NAME:
                    username = resolveSetting(key, settingsClient);
                    break;
                case InviteHandlerConstants.PASSWORD:
                    password = resolveSetting(key, settingsClient);
                    break;
                case InviteHandlerConstants.JDBC_URL:
                    jdbcUrl = resolveSetting(key, settingsClient);
                    resolveDriver(jdbcUrl);
                    break;
                default:
                    LOG.warn("Unknown setting key {}", key);
            }
        });

        // we may have all the info we need to create our connection now
        updateEmf();
    }

    @Override
    public void onStop(String appName) {
        LOG.info("DatabaseConnectionManagerService#onStop");
    }

    @Override
    public Set<String> getSettingKeys() {
        return new HashSet<>(Arrays.asList(
                InviteHandlerConstants.USER_NAME,
                InviteHandlerConstants.PASSWORD,
                InviteHandlerConstants.JDBC_URL));
    }

    /**
     * Get an entity manager if we have managed to connect to the
     * database yet.
     *
     * @return optional containing a em or empty
     */
    @Override
    public Optional<EntityManager> getEm() {
        return (emf == null) ? Optional.empty() : Optional.of(emf.createEntityManager());
    }

    @Override
    public boolean isConnected() {
        try {
            return emf != null && emf.createEntityManager() != null;
        } catch (Exception e) {
            LOG.warn("Failed to resolve is connected");
            return false;
        }
    }

    // attempt to resolve jdbc driver from the supplied connection String, setting our
    // driver field if something is resolved
    private boolean resolveDriver(String urlValue) {
        String driver = JdbcHelper.getJdbcDriverFromConnection(urlValue);
        if (!isNullOrEmpty(driver)) {
            try {
                // attempt to resolve the JDBC driver
                Class.forName(driver);
                jdbcDriver = driver;
                return true;
            } catch (Exception e) {
                LOG.error("We failed to resolve the JDBC driver - {}", driver, e);
                return false;
            }
        }
        return false;
    }

    private void updateEmf() {
        // if we have all of the details then proceed
        if (!isNullOrEmpty(username) && !isNullOrEmpty(password) &&
                !isNullOrEmpty(jdbcDriver) && !isNullOrEmpty(jdbcUrl)) {
            try {
                emf = jpaHelper.getEMF(jdbcUrl, username, password, jdbcDriver);
                // attempt entity manager creation to ensure our EMF is good
                emf.createEntityManager();
            } catch (Exception e) {
                LOG.error("Failed to create the Entity Manager Factory for the invite handler service, " +
                        "please check the service settings", e);
            }
        } else {
            LOG.info("Unable to update EMF yet as we don't have the full set of credentials");
        }
    }

    private String resolveSetting(String key, SettingsClient settingsClient) {
        try {
            return settingsClient.getSettingAsString(key);
        } catch (APIException e) {
            LOG.warn("Failed to lookup setting {} - {}", key, e.getCallInfo());
            return "";
        }
    }

}
