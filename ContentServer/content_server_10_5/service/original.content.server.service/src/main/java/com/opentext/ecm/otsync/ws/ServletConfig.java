package com.opentext.ecm.otsync.ws;

import com.opentext.ecm.otsync.gateway.GatewayServices;
import com.opentext.ecm.otsync.ws.server.ClientType;
import com.opentext.otag.api.services.client.SettingsClient;
import com.opentext.otag.api.shared.types.settings.Setting;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.ResourceBundle;

// TODO make this AppworksServiceContextListener and don't call it explicitly from AbstractOTSyncServlet
public class ServletConfig {

	public static final String APP_NAME = "content";
	
	public static final String DIRECT_URL = "content.directUrl";
	public static final String CLEAN_UP_INTERVAL = "content.cleanUpInterval";
	public static final String UPLOAD_SOCKET_TIMEOUT = "content.uploadSocketTimeout";
	public static final String CS_CONNECTION_TIMEOUT = "content.csConnectionTimeout";
	public static final String REQUEST_TIMEOUT = "content.requestTimeout";
	public static final String CS_CONNECTIONS_MAX = "content.csConnectionsMax";
	public static final String LOGGING_VERBOSE = "content.loggingVerbose";
	public static final String WHITELIST = "content.whitelist";
	public static final String CHUNKEDCONTENT_CACHE_EXPIRY = "content.chunkedcontentCacheExpiry";
	public static final String CHUNKSIZE = "content.chunksize";
	public static final String CS_SYNCTHREADS_MAX = "content.csSyncthreadsMax";
	public static final String TEMPDIR = "otag.tmp.path";
	public static final String REPO = "content.repo";
	public static final String IS_TEMPO_BOX_ENABLED = "content.enableTempoBox";

	public static final Log log = LogFactory.getLog(ServletConfig.class);
    
    private static Properties clientProperties;

    public final static String OTSYNC_WEB_APP_NAME = "OTSyncServer";
    public final static String BACK_CHANNEL_NAME = "BackChannel";
    public final static String NOTIFY_CHANNEL_NAME = "NotifyChannel";
    public final static String FRONT_CHANNEL_NAME = "FrontChannel";
    public final static String CONTENT_CHANNEL_NAME = "ContentChannel";
    public final static String CHUNKED_CONTENT_CHANNEL_NAME = "ChunkedContentChannel";
    public final static String RESOURCE_CONTEXT_NAME = "resources";
    public final static String WADL_NAME = "application.wadl";
    public final static String OTSYNC_URI = "/" + OTSYNC_WEB_APP_NAME + "/";
    public final static String WADL_URI = OTSYNC_URI + RESOURCE_CONTEXT_NAME + "/" + WADL_NAME;
    public final static String BACK_CHANNEL_URI = OTSYNC_URI + BACK_CHANNEL_NAME + "/";
    public final static String FRONT_CHANNEL_URI = OTSYNC_URI + FRONT_CHANNEL_NAME + "/";
    public final static String CONTENT_CHANNEL_URI = OTSYNC_URI + CONTENT_CHANNEL_NAME + "/";
    public final static String CHUNKED_CONTENT_CHANNEL_URI = OTSYNC_URI + CHUNKED_CONTENT_CHANNEL_NAME + "/";
    public final static String BACK_CHANNEL_SERVLET_PATH = "/" + BACK_CHANNEL_NAME;
    public final static String NOTIFY_CHANNEL_SERVLET_PATH = "/" + NOTIFY_CHANNEL_NAME;
    public final static String FRONT_CHANNEL_SERVLET_PATH = "/" + FRONT_CHANNEL_NAME;
    public final static String CONTENT_CHANNEL_SERVLET_PATH = "/" + CONTENT_CHANNEL_NAME;
    public final static String CHUNKED_CONTENT_CHANNEL_SERVLET_PATH = "/" + CHUNKED_CONTENT_CHANNEL_NAME;
    public final static int MAX_MULTIPART_REQUEST_SIZE = 262144; //256kb (should be enough for chunked uploads)
    public static final String URL_FROM_NODEID_PREFIX = "?func=otsyncll&objId=";
    public static final String URL_FROM_NODEID_POSTFIX = "&objAction=download&viewType=1";
    public static final String URL_VERNUM_PREFIX = "&vernum=";
    public static final int DEFAULT_STORED_RESPONSES = 2;
    public final static String CHAR_ENCODING = "UTF-8";
    public static final int MAX_CLIENTS_PER_USER = 256;
    public static final int MAX_ALLOWED_STORED_RESPONSES = 2;
    public static final String CONTENT_NODEID_PARAMETER_NAME = "nodeID";
    public static final String CONTENT_URL_PARAMETER_NAME = "url";
    public static final String CONTENT_VERNUM_PARAMETER_NAME = "vernum";
    
  
    private static Map<String,ClientType> clientInfo = null; //version and link information from tempo.clients.properties 

	
	private static String productName = null;
	private static String shortProductName = null;
	private static String companyName = null;

    public static void init(ServletContext context) { 
    	
    	upgradeFromExistingTempoProperties();
    	
    	// Copy Sample Properties File to conf
    	File sourceFile;
    	File destinationFile;
		String clientFilePath = context.getRealPath("/WEB-INF/tempo.clients.properties");   	
    	String destFileName = System.getProperty("catalina.base") + "/conf/tempo.clients.properties";
    	
    	sourceFile =new File(clientFilePath);  
    	destinationFile =new File(destFileName);
    	try {
    		if(!destinationFile.canRead()) FileUtils.copyFile(sourceFile, destinationFile);
		} catch (IOException e) {
			log.error(e);
		}
        
        // Read and set client properties for client tracking and maintenance
        setClientProperties();
	}
    
    private static void upgradeFromExistingTempoProperties() {
		File propertiesFile = new File(System.getProperty("catalina.base") + "/conf/tempo.properties");
		if(propertiesFile.canRead()){
			
			// read the properties, then rename the file to a backup so we won't look at it again
			Properties properties = new Properties();
			FileInputStream in = null;
			try {
    			in = new FileInputStream(propertiesFile);
				properties.load(in);
	    	} catch (IOException e) {			
				log.error("Cannot load tempo.properties. You will need to set your old configuration manually.");
			} finally {
				try {
					in.close();
				} catch (IOException e) {
					log.info("Error closing tempo.properties input stream.", e);
				}
			}
			
			try {
				FileUtils.moveFile(propertiesFile, new File(System.getProperty("catalina.base") + "/conf/tempo.properties.preupgrade"));
				log.info("Renamed old tempo.properties file to tempo.properties.preupgrade");
			} catch (IOException e) {
				log.warn("Could not rename old tempo.properties file in <tomcat>/conf; please delete or rename this file.", e);
			}
			
//			try {
				setOldProperties(properties);
//			} catch (DBException e) {
//				log.error("Error while upgrading settings.", e);
//			}
		}
	}

	private static void setOldProperties(Properties properties) /*throws DBException */ {
//		importSetting(properties, REPO, "repo");
//		importSetting(properties, TEMPDIR, "TempfileDir");
//		importSetting(properties, CS_SYNCTHREADS_MAX, "cs.syncthreads.max");
//		importSetting(properties, CHUNKSIZE, "ChunkSize");
//		importSetting(properties, CHUNKEDCONTENT_CACHE_EXPIRY, "ChunkedContentCacheExpiryTime");
//		importSetting(properties, WHITELIST, "ValidURLWhiteList");
//		importSetting(properties, LOGGING_VERBOSE, "WantFrontChannelLogs");
//		importSetting(properties, CS_CONNECTIONS_MAX, "cs.connections.max");
//		importSetting(properties, REQUEST_TIMEOUT, "request.timeout");
//		importSetting(properties, CS_CONNECTION_TIMEOUT, "cs.connection.timeout");
//		importSetting(properties, UPLOAD_SOCKET_TIMEOUT, "upload.socket.timeout");
//		importSetting(properties, CLEAN_UP_INTERVAL, "CleanUpInterval");
//
//		String directBaseUrl = properties.getProperty("ContentServerDirectBaseURL");
//		String directRelativeUrl = properties.getProperty("ContentServerDirectRelativeURL");
//		if(directBaseUrl != null && directRelativeUrl != null){
//			String fullDirectUrl = directBaseUrl + directRelativeUrl;
//			log.info("Content service importing " + DIRECT_URL + " as " + fullDirectUrl);
//			Setting directUrl = Setting.getSetting(DIRECT_URL);
//			directUrl.setValue(fullDirectUrl);
//			directUrl.store();
//		}
//
//		importSetting(properties, Mail.OTAG_SMTP_FROM, "com.opentext.tempoinvite.mail.smtp.from");
//		importSetting(properties, Mail.OTAG_SMTP_HOST, "com.opentext.tempoinvite.mail.smtp.host");
//		importSetting(properties, Mail.OTAG_SMTP_PASSWORD, "com.opentext.tempoinvite.mail.smtp.password");
//		importSetting(properties, Mail.OTAG_SMTP_PORT, "com.opentext.tempoinvite.mail.smtp.port");
//		importSetting(properties, Mail.OTAG_SMTP_SSL, "com.opentext.tempoinvite.mail.smtp.ssl");
//		importSetting(properties, Mail.OTAG_SMTP_USERNAME, "com.opentext.tempoinvite.mail.smtp.username");
	}

//	private static void importSetting(Properties properties, String otagSetting, String property) throws DBException {
//		String oldValue = properties.getProperty(property);
//		Setting setting = Setting.getSetting(otagSetting);
//		if(oldValue != null && !oldValue.equals(setting.getValue())){
//			setting.setValue(oldValue);
//			setting.store();
//		}
//	}

    // TODO FIXME centralise in a settings service NOT IN SERVLET CONFIG!!! terrible structure overall here

    private static SettingsClient getSettingsClient() {
        return GatewayServices.getSettingsClient();
    }

    private static boolean getBoolSetting(String key) {
        Setting setting = getSettingsClient().getSetting(key);
        try {
            return Boolean.parseBoolean(setting.getValue());
        } catch (Exception e) {
            return false;
        }
    }

    private static int getIntSetting(String key) {
        Setting setting = getSettingsClient().getSetting(key);
        try {
            return Integer.parseInt(setting.getValue());
        } catch (Exception e) {
            return -1;
        }
    }

    private static long getLongSetting(String key) {
        Setting setting = getSettingsClient().getSetting(key);
        try {
            return Long.parseLong(setting.getValue());
        } catch (Exception e) {
            return -1;
        }
    }

	public static boolean isTempoBoxEnabled(){
        return getBoolSetting(IS_TEMPO_BOX_ENABLED);
    }

    public static String getRepo(){
		return getSettingsClient().getSetting(REPO).getValue();
	}

    public static String getTempfileDir() {
        return getSettingsClient().getSetting(TEMPDIR).getValue();
    }
    
    public static int getSharedThreadPoolSize() {
        return getIntSetting(CS_SYNCTHREADS_MAX);
    }

    public static long getChunkSize() {
        return getLongSetting(CHUNKSIZE);
    }

    public static long getChunkedContentCacheExpiryTime() {
        return getLongSetting(CHUNKEDCONTENT_CACHE_EXPIRY);
    }

    public static String[] getValidURLWhiteList() {
    	String[] validURLWhiteList = {};
    	String whiteList = getSettingsClient().getSetting(WHITELIST).getValue();
    	if (whiteList != null && whiteList.trim().length() > 0) {
            validURLWhiteList = whiteList.split(",");
        }
        return validURLWhiteList;
    }

	public static boolean wantFrontChannelLogs() {
        return getBoolSetting(LOGGING_VERBOSE);
	}
	
	public static boolean shouldForwardChromeUserAgent(){
		return true;
	}

	public static int getCSConnectionPoolSize() {
        return getIntSetting(CS_CONNECTIONS_MAX);
	}

    public static int getServlet3RequestTimeout() {
        return getIntSetting(REQUEST_TIMEOUT);
    }
    
	public static int getConnectionTimeout() {
        return getIntSetting(CS_CONNECTION_TIMEOUT);
	}
	
	public static int getUploadSocketTimeout() {
		return getIntSetting(UPLOAD_SOCKET_TIMEOUT);
	}
    
    public static int getServlet3ContentTimeout() {
    	return getServlet3RequestTimeout() * 30;
    }

	public static long getCleanUpInterval() {
		return getLongSetting(CLEAN_UP_INTERVAL);
	}
	
	public static long getClientTimeOut() {
		return getLongSetting("notifications.cleanup.timeout");
    }

    public static String getContentServerUrl() {
        return getSettingsClient().getSetting("contentserver.url").getValue();
    }

    public static String getContentServerDirectUrl() {
        String url = getSettingsClient().getSetting(DIRECT_URL).getValue();
        if(url == null || url.isEmpty()){
        	url = getContentServerUrl();
        }
		return url;
    }

    public static String getContentServerBaseUrl() {
    	String relativeUrl = getContentServerRelativeURL();
    	String csUrl = getContentServerUrl();
		return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }
    
    public static String getContentServerDirectBaseURL() {
    	String relativeUrl = getContentServerDirectRelativeURL();
    	String csUrl = getContentServerDirectUrl();
		return csUrl.substring(0, csUrl.length() - relativeUrl.length());
    }

    public static String getContentServerRelativeURL() {
		try {
			URI csUri = new URI(getContentServerUrl());
	    	return csUri.getRawPath();
		} catch (URISyntaxException e) {
			log.error(e);
			return "";
		}
    }

    public static String getContentServerDirectRelativeURL() {
		try {
			URI csUri = new URI(getContentServerDirectUrl());
	    	return csUri.getRawPath();
		} catch (URISyntaxException e) {
			log.error(e);
			return "";
		}
    }
    
    public static int getMaxClientsPerUser() {
    	return MAX_CLIENTS_PER_USER;
    }

    public static int getMaxAllowedStoredResponses() {
        return MAX_ALLOWED_STORED_RESPONSES;
    }

	public static String getWebAppName() {
        return OTSYNC_WEB_APP_NAME;
    }

    public static String getBackChannelName() {
        return BACK_CHANNEL_NAME;
    }

    public static String getFrontChannelName() {
        return FRONT_CHANNEL_NAME;
    }

    public static String getContentChannelName() {
        return CONTENT_CHANNEL_NAME;
    }

    public static String getChunkedContentChannelName() {
        return CHUNKED_CONTENT_CHANNEL_NAME;
    }

    public static String getBackChannelUri() {
        return BACK_CHANNEL_URI;
    }

    public static String getFrontChannelUri() {
        return FRONT_CHANNEL_URI;
    }

    public static String getContentChannelUri() {
        return CONTENT_CHANNEL_URI;
    }

    public static String getChunkedContentChannelUri() {
        return CHUNKED_CONTENT_CHANNEL_URI;
    }

    public static String getContentNodeIDParameterName() {
        return CONTENT_NODEID_PARAMETER_NAME;
    }

    public static String getContentVersionNumParameterName() {
        return CONTENT_VERNUM_PARAMETER_NAME;
    }

    public static String getContentUrlParameterName() {
        return CONTENT_URL_PARAMETER_NAME;
    }

    public static String getBackChannelServeletPath() {
        return BACK_CHANNEL_SERVLET_PATH;
    }

	public static String getNotifyChannelServeletPath() {
		return NOTIFY_CHANNEL_SERVLET_PATH;
	}

    public static String getFrontChannelServeletPath() {
        return FRONT_CHANNEL_SERVLET_PATH;
    }

    public static String getContentChannelServeletPath() {
        return CONTENT_CHANNEL_SERVLET_PATH;
    }

    public static String getChunkedContentChannelServeletPath() {
        return CHUNKED_CONTENT_CHANNEL_SERVLET_PATH;
    }

    public static String getWadlUri() {
        return WADL_URI;
    }

    public static String getOTSyncUri() {
        return OTSYNC_URI;
    }

    public static int notifierQueueSize() {
        return Integer.MAX_VALUE;
    }
	
	
	// tempo.clients.properties setter and getters 
        
        private static void setClientProperties(){                
        	
        	clientProperties = new Properties();
        
            try {
    		clientProperties.load(new FileInputStream(System.getProperty("catalina.base") + "/conf/tempo.clients.properties"));
            } catch (FileNotFoundException e) {
                    log.error("Cannot load tempo.clients.properties. Going into server meltdown mode (tempo.clients.properties must be in "
                                    + System.getProperty("catalina.base") + "/conf).");
            } catch (IOException e) {			
                    log.error("Cannot load tempo.clients.properties. Going into server meltdown mode (fix your config).");
            }


            //Add all client information to the clientInfo Map
            clientInfo = new HashMap<String,ClientType>();

            //Loop through all properties building up client information
            for (Map.Entry<Object,Object> entry : clientProperties.entrySet())
            {
                String key = ((String)entry.getKey()).toUpperCase();
                String value = (String)entry.getValue();
                String prefix;
                String languageKey = "";
                ClientType client = null;

                log.debug("Properties: key=" + key + ", value=" + value);

                //Initialize client
                if (key.contains("CLIENT"))
                {
                    //Get the Client Type, including language for use as the client key prefix
                    prefix = key.substring(0,key.indexOf("CLIENT"));

                    if ( key.contains("_"))
                    {
                        languageKey = key.substring(key.indexOf("_") + 1,key.length());
                    }

                    //Retrieve the client info from the clientInfo map, or create new client info map if this is a new client
                    if (clientInfo.containsKey(prefix))
                    {
                        client = clientInfo.get(prefix);
                    }
                    else
                    {
                        client = new ClientType(prefix);
                        clientInfo.put(prefix, client);
                    }
                }

                //Get the Minimum Version, Current Version and Client Link
                if (key.contains("CLIENTVERSIONFORDOWNLOAD"))
                {
                    client.setCurrentVersion(value);
                }
                else if (key.contains("CLIENTVERSION"))
                {
                    client.setMinVersion(value);
                }
                else if (key.contains("CLIENT"))
                {
                    client.setClientLink(value, languageKey);
                }
            }    
        }
        /*
         * Get client information for the default client, WIN64
         * This exists so that legacy Windows clients can still check version
         * requirements without passing the new parameters.
         */
        public static ClientType getClient(){
            
	    log.info("Legacy Windows client connecting");
            return clientInfo.get("WIN64");
        }
        /*
	 * Get client information for a given client type.
	 * As clients are identified in the properties file either by os (Android), os + osVersion (BB6) 
	 * or os + bitness (Win32) all three of these combinations will be tried.
	 * If the properties file changes, users of this method will be unaffected by the internal change.
	 */
        public static ClientType getClient(String clientOS, String clientOSVersion, String clientBitness){
            
	    String os = (clientOS == null) ? "" : clientOS.toUpperCase();
	    String osVersion = (clientOSVersion == null) ? "" : clientOSVersion.toUpperCase();
	    String bitness = (clientBitness == null) ? "" : clientBitness.toUpperCase();
	    
	    if (clientInfo.containsKey(os)){
		return clientInfo.get(os);
	    }
	    else if (clientInfo.containsKey(os + osVersion)){
		return clientInfo.get(os + osVersion);
	    }
	    else if (clientInfo.containsKey(os + bitness)){
		return clientInfo.get(os + bitness);
	    }
		
	    log.info("Unknown client type connecting: os=" + os + ", osVersion=" + osVersion + ", bitness=" + bitness);
            return null;
        }
		
		public static String getProductName(){
			if(productName == null){
				ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
				productName = strings.getString("productName");
			}
			return productName;
		}
		
		public static String getShortProductName(){
			if(shortProductName  == null){
				ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
				shortProductName = strings.getString("shortProductName");
			}
			return shortProductName;
		}     
		
		public static String getCompanyName(){
			if(companyName   == null){
				ResourceBundle strings = ResourceBundle.getBundle("BrandingStrings");
				companyName = strings.getString("companyName");
			}
			return companyName;
		} 
}
