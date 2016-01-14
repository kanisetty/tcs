package com.opentext.otsync.feeds.rest;

import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otag.sdk.handlers.SettingChangeHandler;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

@Path("providers")
@Produces(MediaType.APPLICATION_JSON)
public class ProvidersResource {

    public static class FeedProvider {
        public String name;
        public String localizedName;
        public String color;

        public FeedProvider(String name, String language, String color) {
            this.name = name;
            this.color = color;
            this.localizedName = getLocalizedName(name, language);
        }
    }

    private SettingsClient settingsClient;

    @GET
    public Response getAvailableFeedProviders() {
        List<FeedProvider> providers = getFeedProviders(null);
        return Response.ok(providers).build();
    }

    @GET
    @Path("{language}")
    public Response getAvailableFeedProvidersWithLanguage(@PathParam("language") String language) {
        List<FeedProvider> providers = getFeedProviders(language);
        return Response.ok(providers).build();
    }

    private List<FeedProvider> getFeedProviders(String language) {
        String statusColour = getSettingOrDefault("feeds.statusColour", "007CFF");
        String contentColour = getSettingOrDefault("feeds.contentColour", "AA4CAA");
        String mentionsColour = getSettingOrDefault("feeds.mentionsColour", "58C246");
        String followsColour = getSettingOrDefault("feeds.followsColour", "46C2C0");

        List<FeedProvider> providers = new ArrayList<FeedProvider>(2);
        providers.add(new FeedProvider("PulseStatus", language, statusColour));
        providers.add(new FeedProvider("PulseContent", language, contentColour));
        providers.add(new FeedProvider("PulseMentions", language, mentionsColour));
        providers.add(new FeedProvider("PulseFollows", language, followsColour));
        return providers;
    }

    private static String getLocalizedName(String name, String language) {
        ResourceBundle names;
        if (language != null) {
            Locale locale = new Locale(language);
            names = ResourceBundle.getBundle("FeedNames", locale);
        } else {
            names = ResourceBundle.getBundle("FeedNames");
        }
        return names.getString(name);
    }

    private String getSettingOrDefault(String settingKey, String defaultValue) {
        String val = null;

        try {
            val = getSettingsClient().getSettingAsString(settingKey);
        } catch (Exception ignored) {
        }

        return (val == null) ? defaultValue : val;
    }

    private SettingsClient getSettingsClient() {
        if (settingsClient == null)
            settingsClient = new SettingsClient();

        return settingsClient;
    }

}
