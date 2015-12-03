package com.opentext.otsync.content.engine;

import com.opentext.otsync.content.listeners.*;
import com.opentext.otsync.content.ContentServiceConstants;
import com.opentext.otsync.content.engine.core.SuspendedActionQueue;
import com.opentext.otsync.content.http.HTTPRequestManager;
import com.opentext.otsync.content.message.Message;
import com.opentext.otsync.content.otag.SettingsService;
import com.opentext.otsync.content.ws.ServletUtil;
import com.opentext.otsync.content.ws.message.JsonMessageConverter;
import com.opentext.otsync.content.ws.message.MessageConverter;
import com.opentext.otsync.content.ws.server.CleanUpThread;
import com.opentext.otsync.content.ws.server.ClientSet;
import com.opentext.otsync.content.ws.server.servlet3.Servlet3BackChannel;
import com.opentext.otsync.content.ws.server.servlet3.Servlet3ContentChannel;
import com.opentext.otsync.content.ws.server.servlet3.Servlet3FrontChannel;
import com.opentext.otag.api.shared.types.message.SettingsChangeMessage;
import com.opentext.otag.sdk.client.NotificationsClient;
import com.opentext.otag.sdk.handlers.AbstractSettingChangeHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * The engine:
 * <p>
 * Create message feeds with thread pools. There is one main (shared) pool that will handle all
 * requests headed for content server(external user api calls excepted). In addition, there are
 * separate queues with a small number of dedicated threads for uploads, downloads, and front-channel
 * operations. Each action should be enqueued in the shared pool as well as the appropriate dedicated
 * pool; the suspended action queues will ensure the action is only processed once, by the first
 * available thread in  either pool.
 */
public class ContentServiceEngine {

    public static Log LOG = LogFactory.getLog(ContentServiceEngine.class);

    /**
     * Listens for changes to the CS sync threads - setting desc - Maximum number of Content
     * Server threads to use for automated sync actions. Updating the number of threads
     * available in our engines main Thread pool. Will get instantiated by the Appworks platform.
     */
    @SuppressWarnings("unused")
    public static class ThreadMaxSettingListener extends AbstractSettingChangeHandler {

        @Override
        public String getSettingKey() {
            return ContentServiceConstants.CS_SYNCTHREADS_MAX;
        }

        @Override
        public void onSettingChanged(SettingsChangeMessage message) {
            int threadCount;
            try {
                threadCount = Integer.parseInt(message.getNewValue());
                sharedThreadPool.setThreads(threadCount);
            } catch (NumberFormatException e) {
                LOG.error("Failed to respond to ");
            }
        }

    }

    /**
     * Main ThreadPool, we wrap an Executor and feed it the {@code SuspendedAction} instances
     * we create in response to incoming requests.
     */
    private static SuspendedActionQueue sharedThreadPool;

    private SynchronousMessageSwitch messageHandler;

    private CleanUpThread cleanUpThread;
    private MessageConverter messageConverter;
    private HTTPRequestManager serverConnection;


    // Connected clients
    private ClientSet clients;

    // Channels
    private Servlet3BackChannel backChannel;
    private Servlet3FrontChannel frontChannel;
    private Servlet3ContentChannel contentChannel;


    // Gateway clients
    private SettingsService settingsService;
    private NotificationsClient notificationsClient;

    public ContentServiceEngine(SettingsService settingsService,
                                NotificationsClient notificationsClient,
                                HTTPRequestManager httpRequestManager) {
        LOG.info("Initialising engine");
        this.settingsService = settingsService;
        this.notificationsClient = notificationsClient;

        messageConverter = new JsonMessageConverter();
        clients = new ClientSet();
        serverConnection = httpRequestManager;
        sharedThreadPool = SuspendedActionQueue.getThreadPool(
                settingsService.getSharedThreadPoolSize(), "mainQueue-");

        initListeners();

        sharedThreadPool.start();

        // start a thread to periodically discard inactive clients
        cleanUpThread = new CleanUpThread(clients);
        cleanUpThread.start();

        // initialise channels
        initialiseChannels();
    }

    public Servlet3ContentChannel getContentChannel() {
        return contentChannel;
    }

    public Servlet3FrontChannel getFrontChannel() {
        return frontChannel;
    }

    public Servlet3BackChannel getBackChannel() {
        return backChannel;
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    public void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            if (ServletUtil.isFrontChannelRequest(request)) {
                frontChannel.handle(request);
            } else if (ServletUtil.isBackChannelRequest(request)) {
                backChannel.handle(request, response);
            } else if (ServletUtil.isContentChannelRequest(request)) {
                contentChannel.handle(request, response);
            }
        } catch (Throwable te) {
            LOG.error(te);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "OTSyncServer Reported Error:" + te.getClass().getSimpleName());
        }

    }

    private void initialiseChannels() {
        frontChannel = new Servlet3FrontChannel(sharedThreadPool, messageConverter, messageHandler, settingsService);
        LOG.info("Initialised Front Channel successfully");
        contentChannel = new Servlet3ContentChannel(serverConnection, sharedThreadPool, settingsService);
        LOG.info("Initialised Content Channel successfully");
        backChannel = new Servlet3BackChannel();
        LOG.info("Initialised Back Channel successfully");

    }

    private void initListeners() {
        LOG.info("Setting up Front Channel Listeners");
        // Create a switch which will respond on the {"type"} key in the JSON string.
        // For example, the AuthMessageListener's "onMessage" method will be called when a
        // JSON string with {"type": "auth"} is POSTed to the FrontChannel
        messageHandler = new SynchronousMessageSwitch();

        AuthMessageListener authListener = new AuthMessageListener(messageConverter, serverConnection);
        messageHandler.setHandler(authListener, Message.AUTH_KEY_VALUE);

        ForwardingMessageListener notifyListener =
                new ForwardingMessageListener(
                        new NotifyMessageListener(serverConnection, notificationsClient), clients);
        messageHandler.setHandler(notifyListener, Message.NOTIFY_KEY_VALUE);

        ForwardingMessageListener pulseListener =
                new ForwardingMessageListener(new PulseMessageListener(serverConnection), clients);
        messageHandler.setHandler(pulseListener, Message.PULSE_KEY_VALUE);

        ServerCheckListener serverCheckListener = new ServerCheckListener();
        messageHandler.setHandler(serverCheckListener, Message.SERVER_CHECK_KEY_VALUE);

        ContentRequestListener contentRequestListener = new ContentRequestListener(notificationsClient);
        messageHandler.setHandler(contentRequestListener, Message.CONTENT_KEY_VALUE);
        LOG.info("Completed Channel Listener initialisation");
    }

    public void shutdown() {
        sharedThreadPool.stop();
        cleanUpThread.stopThread();
        LOG.info("Shutdown ContentServiceEngine complete");
    }

}
