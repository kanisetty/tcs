package com.opentext.tempo.notifications;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public final class Messages {

    /**
     * We keep our property files locally within the same package structure as the classes
     * that need them.
     */
    private static final String BUNDLE_NAME = "com.opentext.tempo.invitations.messages";

    private final ResourceBundle resourceBundle;
    private final Locale locale;

    public Messages(Locale locale) {
        super();
        this.resourceBundle = ResourceBundle.getBundle(BUNDLE_NAME, locale);
        this.locale = locale;
    }

    public boolean isValid() {
        return resourceBundle != null;
    }

    public Locale getLocale() {
        return locale;
    }

    public String getString(String key) {
        try {
            return resourceBundle.getString(key);
        } catch (MissingResourceException e) {
            return '!' + key + '!';
        }
    }

    public String getString(String key, Object... args) {
        try {
            return MessageFormat.format(resourceBundle.getString(key), args);
        } catch (MissingResourceException e) {
            return '!' + key + '!';
        }
    }

}

