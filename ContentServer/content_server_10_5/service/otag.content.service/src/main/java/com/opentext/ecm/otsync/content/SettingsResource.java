package com.opentext.ecm.otsync.content;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.otag.api.CSRequest;
import com.opentext.otag.rest.util.CSForwardHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.StreamingOutput;
import java.util.ArrayList;
import java.util.List;

@Path("settings")
@Produces(MediaType.APPLICATION_JSON)
public class SettingsResource {

    @GET
    public StreamingOutput getSettings(@Context HttpServletRequest request) {

        return new CSRequest(ContentServerService.getCsUrl(), "otsync.settings", new ArrayList<>(0),
                new CSForwardHeaders(request));
    }

    @PUT
    public StreamingOutput putSettings(@Context HttpServletRequest request,
                                       @QueryParam("destination_uri") String destination_uri,
                                       @QueryParam("domainBlacklist") String domainBlacklist,
                                       @QueryParam("enableDateSync") Boolean enableDateSync,
                                       @QueryParam("enableDateSyncDisplay") Boolean enableDateSyncDisplay,
                                       @QueryParam("enableExternalSharing") Boolean enableExternalSharing,
                                       @QueryParam("enableNewUserCreation") Boolean enableNewUserCreation,
                                       @QueryParam("enableNotifications") Boolean enableNotifications,
                                       @QueryParam("enablePublish") Boolean enablePublish,
                                       @QueryParam("engine") String engine,
                                       @QueryParam("external_uri") String external_uri,
                                       @QueryParam("log4j_appender_R_MaxBackupIndex") Integer log4j_appender_R_MaxBackupIndex,
                                       @QueryParam("log4j_appender_R_MaxFileSize") String log4j_appender_R_MaxFileSize,
                                       @QueryParam("maxRecords") Integer maxRecords,
                                       @QueryParam("max_send_attempts") Integer max_send_attempts,
                                       @QueryParam("priority") Integer priority,
                                       @QueryParam("proxy_port") String proxy_port,
                                       @QueryParam("proxy_url") String proxy_url,
                                       @QueryParam("queuesize") Integer queuesize,
                                       @QueryParam("retry_delay_ms") Integer retry_delay_ms,
                                       @QueryParam("sharedKey") String sharedKey,
                                       @QueryParam("storageLimit") Integer storageLimit,
                                       @QueryParam("threads") Integer threads,
                                       @QueryParam("useProxy") Boolean useProxy,
                                       @QueryParam("useTempoVolume") Boolean useTempoVolume,
                                       @QueryParam("wantqueuedepth") Boolean wantqueuedepth) {

        List<NameValuePair> params = new ArrayList<>(0);

        /*
        * Only pass through parameters that I found referenced on the back end. Don't allow pass through of logging features that can't (or shouldn't)
        * be changed.
         */
        if ( destination_uri != null ){
            params.add(new BasicNameValuePair("destination_uri", destination_uri));
        }

        if ( domainBlacklist != null ){
            //this should be a comma separated string
            params.add(new BasicNameValuePair("domainBlacklist", domainBlacklist));
        }

        if ( enableDateSync != null ){
            params.add(new BasicNameValuePair("enableDateSync", Boolean.toString(enableDateSync)));
        }

        if ( enableDateSyncDisplay != null ){
            params.add(new BasicNameValuePair("enableDateSyncDisplay", Boolean.toString(enableDateSyncDisplay)));
        }

        if ( enableExternalSharing != null ){
            params.add(new BasicNameValuePair("enableExternalSharing", Boolean.toString(enableExternalSharing)));
        }

        if ( enableNewUserCreation != null ){
            params.add(new BasicNameValuePair("enableNewUserCreation", Boolean.toString(enableNewUserCreation)));
        }

        if ( enableNotifications != null ){
            params.add(new BasicNameValuePair("enableNotifications", Boolean.toString(enableNotifications)));
        }

        if ( enablePublish != null ){
            params.add(new BasicNameValuePair("enablePublish", Boolean.toString(enablePublish)));
        }

        if ( engine != null ){
            params.add(new BasicNameValuePair("engine", engine));
        }

        if ( external_uri != null ){
            params.add(new BasicNameValuePair("external_uri", external_uri));
        }

        if ( log4j_appender_R_MaxBackupIndex != null ){
            params.add(new BasicNameValuePair("log4j_appender_R_MaxBackupIndex", Integer.toString(log4j_appender_R_MaxBackupIndex)));
        }

        if ( log4j_appender_R_MaxFileSize != null ){
            params.add(new BasicNameValuePair("log4j_appender_R_MaxFileSize", log4j_appender_R_MaxFileSize));
        }

        if ( maxRecords != null ){
            params.add(new BasicNameValuePair("maxRecords", Integer.toString(maxRecords)));
        }

        if ( max_send_attempts != null ){
            params.add(new BasicNameValuePair("max_send_attempts", Integer.toString(max_send_attempts)));
        }

        if ( priority != null ){
            params.add(new BasicNameValuePair("priority", Integer.toString(priority)));
        }

        if ( proxy_port != null ){
            params.add(new BasicNameValuePair("proxy_port", proxy_port));
        }

        if ( proxy_url != null ){
            params.add(new BasicNameValuePair("proxy_url", proxy_url));
        }

        if ( queuesize != null ){
            params.add(new BasicNameValuePair("queuesize", Integer.toString(queuesize)));
        }

        if ( retry_delay_ms != null ){
            params.add(new BasicNameValuePair("retry_delay_ms", Integer.toString(retry_delay_ms)));
        }

        if ( sharedKey != null ){
            params.add(new BasicNameValuePair("sharedKey", sharedKey));
        }

        if ( storageLimit != null ){
            params.add(new BasicNameValuePair("storageLimit", Integer.toString(storageLimit)));
        }

        if ( threads != null ){
            params.add(new BasicNameValuePair("threads", Integer.toString(threads)));
        }

        if ( useProxy != null ){
            params.add(new BasicNameValuePair("useProxy", Boolean.toString(useProxy)));
        }

        if ( useTempoVolume != null ){
            params.add(new BasicNameValuePair("useTempoVolume", Boolean.toString(useTempoVolume)));
        }

        if ( wantqueuedepth != null ){
            params.add(new BasicNameValuePair("wantqueuedepth", Boolean.toString(wantqueuedepth)));
        }

        return new CSRequest(ContentServerService.getCsUrl(), "otsync.settings", params,
                new CSForwardHeaders(request));
    }
}
