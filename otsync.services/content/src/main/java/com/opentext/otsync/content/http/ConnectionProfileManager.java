package com.opentext.otsync.content.http;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractMultiSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.otag.SettingsService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.params.HttpClientParams;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;

import java.util.Set;

/**
 * Encapsulates the HTTP connection profile we use to communicate with Content Server.
 * Handles changes tot
 */
public class ConnectionProfileManager extends AbstractMultiSettingChangeHandler implements AWServiceContextHandler {

    private static final Log LOG = LogFactory.getLog(ConnectionProfileManager.class);

    // connection profiles, one per remote operation profile
    private static final HttpParams downloadParams = new BasicHttpParams();
    private static final HttpParams uploadParams = new BasicHttpParams();
    private static final HttpParams frontChannelParams = new BasicHttpParams();

    private SettingsService settingsService;

    @Override
    public Set<String> getSettingKeys() {
        // populated onStart
        return handlers.keySet();
    }

    /**
     * Listen for Gateway init.
     *
     * @param appName name of the app being started
     */
    @Override
    public void onStart(String appName) {
        settingsService = new SettingsService(new SettingsClient());

        String apiCallErr = "API call failed - ";
        try {
            /**
             * Downloads: long socket timeout times, as the data may take a long time for the server to prepare. No
             *   redirecting, as we don't want to serve up a login or error page from Content Server.
             * Uploads: configurable, moderately-long timeout as the server may take a while to process the uploaded data.
             * Front-channel: shorter socket timeout, as there is no point in waiting longer than the
             *   request is active.
             * Connection timeout in all cases is shorter, as the server is either down or busy if it takes
             *   long at all to get a connection.
             */
            setConnectionTimeoutParams();
            setRequestTimeoutParams();
            setUploadTimeoutParams();
            HttpClientParams.setRedirecting(downloadParams, false);

            // add the handlers for the settings we are interested in
            addHandler(ContentServiceConstants.CS_CONNECTION_TIMEOUT, (s) -> {
                LOG.info("Updating upstream http connection timeout");
                try {
                    setConnectionTimeoutParams();
                } catch (APIException e) {
                    throw new RuntimeException("API call failed - " + e.getCallInfo());
                }
            });
            addHandler(ContentServiceConstants.REQUEST_TIMEOUT, (s) -> {
                LOG.info("Updating upstream http request timeout");
                try {
                    setRequestTimeoutParams();
                } catch (APIException e) {
                    throw new RuntimeException("API call failed - " + e.getCallInfo());
                }
            });
            addHandler(ContentServiceConstants.UPLOAD_SOCKET_TIMEOUT, (s) -> {
                LOG.info("Updating upstream http upload socket timeout");
                try {
                    setUploadTimeoutParams();
                } catch (APIException e) {
                    throw new RuntimeException(apiCallErr + e.getCallInfo());
                }
            });
        } catch (APIException e) {
            throw new RuntimeException(apiCallErr + e.getCallInfo());
        }
    }

    @Override
    public void onStop(String appName) {
    }

    public static HttpParams getFrontChannelParams() {
        return frontChannelParams;
    }

    public static HttpParams getUploadParams() {
        return uploadParams;
    }

    public static HttpParams getDownloadParams() {
        return downloadParams;
    }

    private void setConnectionTimeoutParams() throws APIException {
        if (settingsService != null) {
            final int connectionTimeout = settingsService.getConnectionTimeout();
            HttpConnectionParams.setConnectionTimeout(downloadParams, connectionTimeout);
            HttpConnectionParams.setConnectionTimeout(uploadParams, connectionTimeout);
            HttpConnectionParams.setConnectionTimeout(frontChannelParams, connectionTimeout);
        }
    }

    private void setRequestTimeoutParams() throws APIException {
        if (settingsService != null) {
            HttpConnectionParams.setSoTimeout(downloadParams,
                    settingsService.getServlet3ContentTimeout());
            HttpConnectionParams.setSoTimeout(frontChannelParams,
                    settingsService.getServlet3RequestTimeout());
        }
    }

    private void setUploadTimeoutParams() throws APIException {
        HttpConnectionParams.setSoTimeout(uploadParams, settingsService.getUploadSocketTimeout());
    }

}
