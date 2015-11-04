
package com.opentext.ecm.otsync.message;

import java.io.IOException;
import java.util.Map;

public interface SynchronousMessageListener {

    Map<String,Object> onMessage(Map<String,Object> message) throws IOException;

}
