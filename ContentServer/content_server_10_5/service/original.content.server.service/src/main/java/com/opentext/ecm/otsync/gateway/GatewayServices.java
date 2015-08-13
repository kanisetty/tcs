package com.opentext.ecm.otsync.gateway;

import com.opentext.otag.api.services.client.IdentityServiceClient;
import com.opentext.otag.api.services.client.MailClient;
import com.opentext.otag.api.services.client.NotificationsClient;
import com.opentext.otag.api.services.client.SettingsClient;

/**
 * Central index for Gateway service clients in our service.
 */
public class GatewayServices {

    private static GatewayServices instance;

    private IdentityServiceClient identityServiceClient;
    private SettingsClient settingsClient;
    private MailClient mailClient;
    NotificationsClient notificationsClient;

    // private singleton ctor
    private GatewayServices(String appName) {
        identityServiceClient = new IdentityServiceClient(appName);
        settingsClient = new SettingsClient(appName);
        mailClient = new MailClient(appName);
        notificationsClient = new NotificationsClient(appName);
    }

    public static GatewayServices init(String appName) {
        instance = new GatewayServices(appName);
        return instance;
    }

    // service methods

    public static IdentityServiceClient getIdServiceClient() {
        return instance().identityServiceClient;
    }

    public static SettingsClient getSettingsClient() {
        return instance().settingsClient;
    }

    public static MailClient getMailClient() {
        return instance().mailClient;
    }

    public static NotificationsClient getNotificationsClient() {
        return instance.notificationsClient;
    }

    private static GatewayServices instance() {
        if (instance == null)
            throw new IllegalStateException("Please init() before using the services");
        return instance;
    }

}