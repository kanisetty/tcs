package com.opentext.otsync.content.otag;

import com.opentext.otsync.content.ws.server.ClientTypeSet;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static com.opentext.otsync.content.ContentServiceConstants.*;

/**
 * This class is responsible for updating the cached client version settings
 * used to determine whether a connecting client meets the minimum requirements
 * or needs to upgrade. When the Admin changes these settings they need to be reflected immediately
 * in incoming authentication requests.
 */
public class ClientVersionSettingsHandler extends AbstractMultiSettingChangeHandler
        implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ClientVersionSettingsHandler.class);

    @Override
    public void onStart(String appName) {

        LOG.info("Registering settings handlers for Client Version settings");

        addHandler(MIN_VERSION_MAC, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    MIN_VERSION_MAC + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });

        addHandler(CUR_VERSION_MAC, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    CUR_VERSION_MAC + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });

        addHandler(INSTALL_FOLDER_MAC, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    INSTALL_FOLDER_MAC + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });

        addHandler(MIN_VERSION_WIN, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    MIN_VERSION_WIN + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });

        addHandler(CUR_VERSION_WIN, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    CUR_VERSION_WIN + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });

        addHandler(INSTALL_FOLDER_WIN, (s) -> {
            LOG.info("Restarting trusted server key thread as " +
                    INSTALL_FOLDER_WIN + " was changed to " + s.getNewValue());
            ClientTypeSet.buildClientLinks();
        });
    }

    @Override
    public void onStop(String s) {

    }

    @Override
    public Set<String> getSettingKeys() {
        return new HashSet<>(Arrays.asList(
                MIN_VERSION_MAC,
                CUR_VERSION_MAC,
                INSTALL_FOLDER_MAC,
                MIN_VERSION_WIN,
                CUR_VERSION_WIN,
                INSTALL_FOLDER_WIN));
    }
}
