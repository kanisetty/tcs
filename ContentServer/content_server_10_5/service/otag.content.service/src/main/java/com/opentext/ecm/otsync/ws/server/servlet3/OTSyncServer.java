package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.otag.ContentServerService;
import com.opentext.ecm.otsync.engine.ContentServiceEngine;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import java.io.IOException;

@SuppressWarnings("serial")
public class OTSyncServer extends HttpServlet {

	public static Log LOG = LogFactory.getLog(OTSyncServer.class);

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		processRequest(request, response);
	} 

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		processRequest(request, response);
	}

    private void processRequest(HttpServletRequest request, HttpServletResponse response) {
        ContentServiceEngine engine = ContentServerService.getEngine();
        if (engine != null) {
            try {
                engine.processRequest(request, response);
            } catch (ServletException | IOException e) {
                String errMsg = "Failed to process request, " + e.getMessage();
                LOG.error(errMsg, e);
                throw new WebApplicationException(errMsg);
            }
        } else {
            LOG.warn("Dropped request, engine has not started yet");
        }
    }

}
