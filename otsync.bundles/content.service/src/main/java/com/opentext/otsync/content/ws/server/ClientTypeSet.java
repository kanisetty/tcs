package com.opentext.otsync.content.ws.server;

import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.otag.SettingsService;
import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.otsync.content.ws.server.ClientType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * This class represents client installers for all known desktop clients.
 * When connecting to Tempo Box client versions should be checked against the list of allowed clients and
 * access blocked if below the threshold.
 */
public class ClientTypeSet {

    private static Map<String,ClientType> _clientInstallers;
    private static SettingsService _settingsService;
    private static Log log = LogFactory.getLog(ClientTypeSet.class);

    private static final String WINDOWS_CLIENT_NAME_PREFIX = "opentext_tempo_box_";
    private static final String WINDOWS_CLIENT_NAME_SUFFIX = ".exe";
    private static final String MAC_CLIENT_NAME_PREFIX = "opentext tempo box";
    private static final String MAC_CLIENT_NAME_SUFFIX = ".dmg";
    private static final String[] BITNESS_LIST = {"32","64"};
    private static final String[] LANGUAGE_LIST = {"cn", "de", "es", "en", "fr", "it", "ja", "nl", "pt", "ru"};
    private static final String DEFAULT_LANGUAGE = "en";
    private static final String MAC_CLIENT_KEY = "macOS";
    private static final String WIN_CLIENT_KEY = "win";

    public ClientTypeSet(){

        if (_settingsService == null){
            _settingsService = new SettingsService(new SettingsClient());
        }

        buildClientLinks();
    }

    /**
     * Read the AppWorks settings for the Content Service and cache the client info
     */
    public static void buildClientLinks(){

        if (_clientInstallers == null){
            _clientInstallers = new HashMap<>();
        }

        // Build Mac client info
        ClientType macClient = new ClientType(MAC_CLIENT_KEY);
        macClient.setMinVersion(_settingsService.getMinVersionMac());
        macClient.setCurrentVersion(_settingsService.getCurVersionMac());

        String installFolderMac = _settingsService.getInstallerFolderMac();
        String macName = MAC_CLIENT_NAME_PREFIX + MAC_CLIENT_NAME_SUFFIX;
        if (!installFolderMac.substring(installFolderMac.length() - 1).equals("/")){
            installFolderMac += "/";
        }

        macClient.setClientLink(installFolderMac + macName);
        _clientInstallers.put(MAC_CLIENT_KEY.toLowerCase(), macClient);

        // Build Windows client info
        for (String b : BITNESS_LIST){
            String clientKey = WIN_CLIENT_KEY + b;
            ClientType winClient = new ClientType(clientKey);
            winClient.setMinVersion(_settingsService.getMinVersionWin());
            winClient.setCurrentVersion(_settingsService.getCurVersionWin());

            String installFolderWin = _settingsService.getInstallerFolderWin();
            if (!installFolderWin.substring(installFolderWin.length() - 1).equals("/")){
                installFolderWin += "/";
            }

            for (String l : LANGUAGE_LIST){
                String clientName = installFolderWin + WINDOWS_CLIENT_NAME_PREFIX + l + "_" + b + WINDOWS_CLIENT_NAME_SUFFIX;
                winClient.setClientLink(clientName, l);
            }

            winClient.setClientLink(winClient.getLink(DEFAULT_LANGUAGE));
            _clientInstallers.put(clientKey.toLowerCase(), winClient);
        }
    }

    /**
     * Check that the current version reported by the client is higher than the minimum version allowed
     *
     * @param osKey         - key used to get the appropriate client from the _clientInstallers list, ie. "mac", "win32", "win64"
     * @param version       - string version "major.minor.patch"
     * @return              - true iff version is higher than or equal to the minimum for the selected client
     */
    public boolean isVersionAllowed(String osKey, String version){
        ClientType client = _clientInstallers.get(osKey.toLowerCase());
        if (client == null){
            log.warn("Client reported an unknown type:" + osKey);
            return false;
        }

        ClientVersion min = new ClientVersion(client.getMinVersion());
        ClientVersion ver = new ClientVersion(version);
        return !min.isLesser(ver);
    }

    /**
     * Find the required client, get the URL for its installer, and add the server info if the URL is relative
     *
     * @param message   - Auth request map with legacy FrontChannel auth payload
     * @return          - URL (String) for the appropriate client, empty string if not found
     */
    public String getInstallerLink(Map<String,Object> message){
        String os = (String) message.getOrDefault(Message.CLIENT_OS_KEY_NAME, "");
        String bitness = (String) message.getOrDefault(Message.CLIENT_BITNESS_KEY_NAME, "");
        String lang = (String) message.getOrDefault(Message.CLIENT_LANGUAGE_KEY_NAME, "");

        String clientKey = os.toLowerCase();
        if (os.equalsIgnoreCase(WIN_CLIENT_KEY)){
            clientKey += bitness;
        }

        ClientType client = _clientInstallers.get(clientKey);

        if (client != null && !client.getLink(lang).isEmpty()){
            return client.getLink(lang);
        }

        return null;
    }
    /**
     * Get the reported client info and determine whether the client meets the minimum requirements
     * Whether accepted or rejected, include the latest client info
     *
     * @param message   - Map containing the incoming request body
     * @return          - Map containing info on the latest available clients, if below required version auth=false
     *
     */
    public Map<String,Object> doClientVersionCheck(Map<String,Object> message){
        ClientType client = null;
        Map<String,Object> result = new HashMap<>();

        String os = (String) message.getOrDefault(Message.CLIENT_OS_KEY_NAME, "");
        String bitness = (String) message.getOrDefault(Message.CLIENT_BITNESS_KEY_NAME, "");
        String version = (String) message.getOrDefault(Message.VERSION_KEY_NAME, "");

        String clientKey = os;

        if ( clientKey != null ){

            if (clientKey.equalsIgnoreCase(WIN_CLIENT_KEY)){
                clientKey += bitness;
            }

            if ( clientKey != null )
                client = _clientInstallers.get(clientKey.toLowerCase());

            if (client == null){
                log.warn("Client reported an unknown type:" + clientKey);
                return result;
            }
        } else {
            log.warn("Client reported an unknown type:" + clientKey);
            return result;
        }


        result.put(Message.CLIENT_OS_RET_KEY, clientKey);                        //OS of current client type
        result.put(Message.CLIENT_CURRENT_RET_KEY, client.getCurrentVersion());  //current downloadable version of client
        result.put(Message.CLIENT_MIN_RET_KEY, client.getMinVersion());          //minimum allowed version of client
        result.put(Message.CLIENT_LINK_RET_KEY, getInstallerLink(message));      //link to current downloadable version

        Boolean versionAllowed = isVersionAllowed(clientKey, version);
        result.put(Message.CLIENT_NEEDS_UPGRADE, !versionAllowed.booleanValue());

        return result;
    }
}
