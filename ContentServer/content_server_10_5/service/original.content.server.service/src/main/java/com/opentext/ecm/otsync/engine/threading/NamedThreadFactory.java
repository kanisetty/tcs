package com.opentext.ecm.otsync.engine.threading;

import java.util.concurrent.ThreadFactory;

public class NamedThreadFactory implements ThreadFactory {
	final String name;
	int i = 0;
	
	public NamedThreadFactory(final String name){
		this.name = name;
	}
	
	@Override
	public Thread newThread(Runnable r) {
		return new Thread(r, name + i++);
	}

}
