package com.opentext.tempo.external.invites.email;

import com.opentext.otag.sdk.handlers.AbstractSettingChangeHandler;
import com.opentext.otag.sdk.types.v3.message.SettingsChangeMessage;
import com.opentext.tempo.external.invites.InviteHandlerConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Looks after our "email from" setting.
 */
public class EmailFromAddressHandler extends AbstractSettingChangeHandler {

    private static final Logger LOG = LoggerFactory.getLogger(EmailFromAddressHandler.class);

    /**
     * Our send-as persona email address.
     */
    private String emailFromAddress;

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

    public String getFromAddress() {
        return emailFromAddress;
    }

    public void setEmailFromAddress(String emailFromAddress) {
        this.emailFromAddress = emailFromAddress;
    }

}
