package com.opentext.ecm.otsync.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Tracks a number for zero or more keys. Each key may be incremented and decremented, and the current
 * count determined.
 * 
 * Thread safe.
 *
 * @param <K>
 */
public class MultiCounter<K> {
	
	private Map<K, Integer> _elementCounts = new HashMap<K, Integer>();
	
	public synchronized int getCount(K key){
		if(_elementCounts.containsKey(key)){
			return _elementCounts.get(key);
			
		} else {
			return 0;
		}
	}
	
	public synchronized void increment(K key){
		int currentCount = getCount(key);
		
		currentCount++;
		
		_elementCounts.put(key, currentCount);
	}
	
	public synchronized void decrement(K key){
		int currentCount = getCount(key);
		
		currentCount--;
		
		if(currentCount >= 0){
			_elementCounts.put(key, currentCount);
			
		} else {
			_elementCounts.remove(key);
		}
	}
}
