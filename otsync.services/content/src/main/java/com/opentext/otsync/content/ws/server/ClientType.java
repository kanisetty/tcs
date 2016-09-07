package com.opentext.otsync.content.ws.server;

import java.util.HashMap;
import java.util.Map;

/**
 * The ClientType class represents all known data about types of clients connecting to the Tempo Engine.
 * Currently client types include Windows, Mac, Android, BlackBerry, iOS and Web
 */
public class ClientType {
    
    private String os = "";
    private String minVersion = "";
    private String currentVersion = "";
    private String defaultLink = "";
    private Map<String,String> clientLinks;
    
    public ClientType(String clientOS){
        os = clientOS;
        clientLinks = new HashMap<>();
    }
    
    public void setMinVersion(String clientMinVersion){
        minVersion = clientMinVersion;
    }
    
    public void setCurrentVersion(String clientCurrentVersion){
        currentVersion = clientCurrentVersion;
    }
    
    public void setClientLink(String clientLink){
        defaultLink = clientLink;
    }
    
    public void setClientLink(String clientLink, String language){
        
        //If the language is not present, use this link as the default
        if (language == null || "".equals(language)){
            defaultLink = clientLink;
        }
        else{
            clientLinks.put(language.toUpperCase(),clientLink);
        }
    }
    
    public String getOS(){
        return os;
    }
    
    public String getMinVersion(){
        return minVersion;
    }
    
    public String getCurrentVersion(){
        return currentVersion;
    }
    
    public String getLink(){
        return defaultLink;
    }
    
    public String getLink(String language){
        
        if (language != null && clientLinks.containsKey(language.toUpperCase())){
            return clientLinks.get(language.toUpperCase());
        }
        
        return defaultLink;
    }

    public Map<String,String> getAllLinks(){
        return clientLinks;
    }
    
    /*
     * Return TRUE if version is greater than or equal to the specified minimum version for the client.
     * If no minimum is specified this will always return TRUE
     */
    public boolean isVersionAllowed(String version){
	ClientVersion minClient = new ClientVersion(minVersion);
	
	return !minClient.isLesser(version);
    }
            
}
