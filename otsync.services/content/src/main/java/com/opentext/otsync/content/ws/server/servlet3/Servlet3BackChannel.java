package com.opentext.otsync.content.ws.server.servlet3;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

/**
 * ** README !!! **
 * This class previously has direct access to the Gateways Notifications service (in-process)
 * this is no longer true so it cannot pick off the AsyncContext object from the incoming
 * request and store it in the same way. All of the code around this refers to the legacy
 * Tempo clients, they must now use the Gateways GET notifications endpoint to participate
 * in the notification backchannel.
 */
@Deprecated
public class Servlet3BackChannel {

	public Servlet3BackChannel() {
	}

    public void handle(HttpServletRequest request, HttpServletResponse response) {
		throw new WebApplicationException(
				"Notification BackChannel access has been removed from the Content Service",
                Response.Status.BAD_REQUEST);
    }
}
