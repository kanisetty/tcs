package com.opentext.otsync.content.otag;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.message.SettingsChangeMessage;
import com.opentext.otag.sdk.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GatewayUrlSettingService extends AbstractSettingChangeHandler implements AWServiceContextHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GatewayUrlSettingService.class);

    private static final String OTAG_URL_SETTING_KEY = "otag.url";

    /**
     * The URL we should contact the Gateway on. This may be a virtual address
     * supporting a number of actual Gateways.
     */
    private String gatewayUrl = "";

    @Override
    public void onStart(String appName) {
        setValue();
    }

    @Override
    public void onStop(String appName) {
    }

    @Override
    public String getSettingKey() {
        return OTAG_URL_SETTING_KEY;
    }

    @Override
    public void onSettingChanged(SettingsChangeMessage message) {
        if (OTAG_URL_SETTING_KEY.equals(message.getKey())) {
            gatewayUrl = message.getNewValue();
            logSet();
        }
    }

    /**
     * Get the AppWorks Gateway URL as supplied by the managing Gateway, trailing slashes
     * will be removed.
     *
     * @return Gateway URL
     */
    public String getGatewayUrl() {
        if (StringUtil.isNullOrEmpty(gatewayUrl)) {
            setValue();
        }
        return stripTrailingSlash(gatewayUrl);
    }

    private void setValue() {
        try {
            SettingsClient sdkClient = new SettingsClient();
            gatewayUrl = sdkClient.getSettingAsString(OTAG_URL_SETTING_KEY);
            logSet();
        } catch (APIException e) {
            LOG.error("Failed to retrieve Gateway URL setting {}", e.getMessage(), e);
        }
    }

    private void logSet() {
        LOG.info("Set the Gateway URL value to {}", gatewayUrl);
    }

    private String stripTrailingSlash(String url) {
        if (url != null && url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }

}
