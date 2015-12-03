package com.opentext.otsync.content.ws.server.servlet3;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * ** README !!! **
 * This class previously has direct access to the Gateways Notifications service (in-process)
 * this is no longer true so it cannot pick of the AsyncContext object from the incoming
 * request and store it in the same way. All of the code around this refers to the legacy
 * Tempo clients
 *
 * TODO FIXME ask if this is still required, if so expose via OTAG
 */
@Deprecated
public class Servlet3BackChannel {

	private static final Log LOG = LogFactory.getLog(Servlet3BackChannel.class);

	public Servlet3BackChannel() {
	}

    public void handle(HttpServletRequest request, HttpServletResponse response) {
		LOG.error("Servlet3BackChannel has been deprecated");
    }
}
