package com.opentext.ecm.otsync.engine.core;

import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import com.opentext.ecm.otsync.engine.threading.NamedThreadFactory;
import com.opentext.ecm.otsync.ws.ServletConfig;
import com.opentext.ecm.otsync.ws.server.AbstractOTSyncServlet;

/**
 * Enqueues actions (which must implement SuspendedAction) 
 * to be run when both a thread and a resource from the given pool are available.
 *
 */
public class SuspendedActionQueue {
	
	private final ThreadPoolExecutor feed;

	public SuspendedActionQueue(final ThreadPoolExecutor feed){
		if(feed == null) throw new IllegalArgumentException("null parameter");
		this.feed = feed;
	}
	
	public static SuspendedActionQueue getThreadPool(int threadCount, String name){
		return new SuspendedActionQueue((ThreadPoolExecutor)Executors.newFixedThreadPool(threadCount, new NamedThreadFactory(name)));
	}
	
	public void send(SuspendedAction action){
		logOnEnqueue(action);
		feed.execute(action);
	}
	
	public void sendImmediately(SuspendedAction action){
		logOnExecute(action);
		action.run();
	}

	protected void logOnExecute(SuspendedAction action) {
		if(ServletConfig.wantFrontChannelLogs()){
    		AbstractOTSyncServlet.log.info(
    				new StringBuilder()
    				.append("Got message of type ").append(action.logType()).append(" (handling on request thread)").append("\n")
    				.append("   subtype=").append(action.subType()).append("\n")
    				.append("   clientid=").append(action.clientID())
    				.toString());
    	}
	}

	protected void logOnEnqueue(SuspendedAction action) {
		if(ServletConfig.wantFrontChannelLogs()){
    		AbstractOTSyncServlet.log.info(
    				new StringBuilder()
    				.append("Got message of type ").append(action.logType()).append("\n")
    				.append("   queue depth=").append(size()).append("\n")
    				.append("   subtype=").append(action.subType()).append("\n")
    				.append("   clientid=").append(action.clientID())
    				.toString());
    	}
	}
	
	public void setThreads(int threadCount){
		AbstractOTSyncServlet.log.info("Changing content service thread count to " + threadCount);
		feed.setCorePoolSize(threadCount);
		feed.setMaximumPoolSize(threadCount);
	}
	
	public int size(){
		return feed.getQueue().size();
	}
    
    public void start(){
    	// no-op
    }
    
    public void stop(){
    	feed.shutdownNow();
    }
}
