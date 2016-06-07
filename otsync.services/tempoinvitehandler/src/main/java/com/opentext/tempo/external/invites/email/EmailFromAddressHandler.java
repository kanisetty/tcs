package com.opentext.tempo.external.invites.email;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.handlers.AWServiceContextHandler;
import com.opentext.otag.sdk.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.otag.sdk.types.v3.message.SettingsChangeMessage;
import com.opentext.otag.sdk.util.StringUtil;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Looks after our "email from" setting.
 */
public class EmailFromAddressHandler extends AbstractSettingChangeHandler implements AWServiceContextHandler {

    private static final Logger LOG = LoggerFactory.getLogger(EmailFromAddressHandler.class);

    /**
     * Our send-as persona email address.
     */
    private String emailFromAddress;

    // SDK client
    private SettingsClient settingsClient;

    @Override
    public String getSettingKey() {
        return InviteHandlerConstants.EMAIL_FROM;
    }

    @Override
    public void onSettingChanged(SettingsChangeMessage message) {
        String newValue = message.getNewValue();
        LOG.info("\"From Address\" setting has been updated - {}", newValue);
        emailFromAddress = newValue;
    }

    @Override
    public void onStart(String appName) {
        setValue();
    }

    private void setValue() {
        // set our initial "email from" address setting value using the Gateway
        try {
            settingsClient = new SettingsClient();
            emailFromAddress = settingsClient.getSettingAsString(InviteHandlerConstants.EMAIL_FROM);
        } catch (APIException e) {
            LOG.error("Failed to retrieve {} setting", InviteHandlerConstants.EMAIL_FROM, e.getCallInfo());
        }
    }

    @Override
    public void onStop(String appName) {
    }

    public String getFromAddress() {
        if (StringUtil.isNullOrEmpty(emailFromAddress) && settingsClient != null)
            setValue();
        return emailFromAddress;
    }

    public void setEmailFromAddress(String emailFromAddress) {
        this.emailFromAddress = emailFromAddress;
    }

}
