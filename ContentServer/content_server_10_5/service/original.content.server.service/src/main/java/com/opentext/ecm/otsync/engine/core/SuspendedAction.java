package com.opentext.ecm.otsync.engine.core;

import java.util.concurrent.atomic.AtomicBoolean;

public abstract class SuspendedAction implements Runnable {
	private final AtomicBoolean isAvailable = new AtomicBoolean(true);
	
	abstract public void resume();
	abstract public String logType();
	
	public String subType(){ return "N/A"; }
	public String clientID(){ return "N/A"; }
	
	public boolean checkAndUnsetIsAvailable(){
		return isAvailable.getAndSet(false);
	}
	
	public void run() {
		if(checkAndUnsetIsAvailable())
			resume();
	}
}