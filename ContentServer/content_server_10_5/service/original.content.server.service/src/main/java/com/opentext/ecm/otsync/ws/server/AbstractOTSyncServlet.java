package com.opentext.ecm.otsync.ws.server;

import com.opentext.ecm.otsync.engine.core.SuspendedActionQueue;
import com.opentext.ecm.otsync.http.ContentServiceHttpClient;
import com.opentext.ecm.otsync.listeners.*;
import com.opentext.ecm.otsync.message.Message;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.message.JsonMessageConverter;
import com.opentext.ecm.otsync.ws.message.MessageConverter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

@SuppressWarnings("serial")
public abstract class AbstractOTSyncServlet extends HttpServlet {

	public static Log log = LogFactory.getLog(AbstractOTSyncServlet.class);

	// TODO FIXME IDE is complaining about the default method, its due to the fact this is an abstract class maybe
//	public class ThreadPoolMaxHandler extends AbstractSettingChangeHandler {
//
//		@Override
//		public String getSettingKey() {
//			return ServletConfig.CS_SYNCTHREADS_MAX;
//		}
//
//		@Override
//		public void onSettingChanged(SettingsChangeMessage settingsChangeMessage) {
//			if (sharedThreadPool != null)
//				sharedThreadPool.setThreads(Integer.parseInt(settingsChangeMessage.getNewValue()));
//		}
//	}

	protected SuspendedActionQueue sharedThreadPool;
	protected SynchronousMessageSwitch messageHandler;
	protected CleanUpThread cleanUpThread;
	protected MessageConverter messageConverter;
	protected ContentServiceHttpClient serverConnection;
	protected ChunkedContentRequestQueue chunkedContentRequestQueue;

	private ClientSet clients;

	public AbstractOTSyncServlet() {
		super();
	}

	// TODO FIXME DANGER!!! check we dont do anything dangerous here, use the proper listener otherwise
	@Override
	public void init(javax.servlet.ServletConfig config) throws ServletException {
		super.init(config);

		// TODO FIXME YUP THERE IS DANGER AFOOT HERE, WE ARE TRYING TO WORK WITH SETTINGS THAT WE WONT HAVE
		// ACCESS TO
		ServletConfig.init(getServletContext());

		messageConverter = new JsonMessageConverter();
		clients = new ClientSet();
		serverConnection = new ContentServiceHttpClient();

		// Create message feeds with thread pools. There is one main (shared) pool that will handle all requests headed for content server
		// (external user api calls excepted). In addition, there are separate queues with a small number of dedicated threads for
		// uploads, downloads, and front-channel operations. Each action should be enqueued in the shared pool as well as the appropriate
		// dedicated pool; the suspended action queues will ensure the action is only processed once, by the first available thread in
		// either pool.
		sharedThreadPool = SuspendedActionQueue.getThreadPool(ServletConfig.getSharedThreadPoolSize(), "mainQueue-");
		
		// chunked uploads and downloads use the same thread pools as regular uploads and downloads
		chunkedContentRequestQueue = new ChunkedContentRequestQueue(
				serverConnection, 
				messageConverter, 
				sharedThreadPool);
		
		initListeners();

		sharedThreadPool.start();
		
		// start a thread to periodically discard inactive clients
		cleanUpThread = new CleanUpThread(clients, chunkedContentRequestQueue);
		cleanUpThread.start();
	}

	// TODO FIXME THESE LISTENERS ARE INJECTED INTO THE FRONT CHANNEL ONLY!!!
	private void initListeners() {
		// Create a switch which will respond on the {"type"} key in the JSON string. 
		// For example, the AuthMessageListener's "onMessage" method will be called when a JSON string with {"type": "auth"} 
		// is POSTed to the FrontChannel		
		messageHandler = new SynchronousMessageSwitch();

		AuthMessageListener authListener = new AuthMessageListener(messageConverter, serverConnection);
		messageHandler.setHandler(authListener, Message.AUTH_KEY_VALUE);

		ForwardingMessageListener notifyListener = new ForwardingMessageListener(new NotifyMessageListener(serverConnection), clients);
		messageHandler.setHandler(notifyListener, Message.NOTIFY_KEY_VALUE);

		ForwardingMessageListener pulseListener = new ForwardingMessageListener(new PulseMessageListener(serverConnection), clients);
		messageHandler.setHandler(pulseListener, Message.PULSE_KEY_VALUE);

		ServerCheckListener serverCheckListener = new ServerCheckListener();
		messageHandler.setHandler(serverCheckListener, Message.SERVER_CHECK_KEY_VALUE);
		
		ChunkedContentRequestListener chunkedContentRequestListener = new ChunkedContentRequestListener(chunkedContentRequestQueue);
		messageHandler.setHandler(chunkedContentRequestListener, Message.CHUNKED_CONTENT_KEY_VALUE);
		
		ContentRequestListener contentRequestListener = new ContentRequestListener();
		messageHandler.setHandler(contentRequestListener, Message.CONTENT_KEY_VALUE);
	}

	public void destroy() {
		sharedThreadPool.stop();
		cleanUpThread.stopThread();
	}

}
