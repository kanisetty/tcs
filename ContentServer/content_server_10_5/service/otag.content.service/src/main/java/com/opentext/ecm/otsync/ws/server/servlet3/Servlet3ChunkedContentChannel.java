package com.opentext.ecm.otsync.ws.server.servlet3;

import com.opentext.ecm.otsync.listeners.ChunkedContentRequestQueue;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.AbstractChunkedContentChannel;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Servlet3ChunkedContentChannel extends
AbstractChunkedContentChannel {

	public Servlet3ChunkedContentChannel(final ChunkedContentRequestQueue queue) {
		super(queue);
	}

	public void handle(final HttpServletRequest request, final HttpServletResponse response) {
		if(ServletUtil.isGet(request)){

			chunkedDownload(request, response);

		} else if(ServletUtil.isPost(request)){

			try {
				
				log.info("Uploading chunk.");
				
				_queue.uploadFile(request, response);
			} catch (IOException e) {
				log.error("Error during chunked upload", e);
				ServletUtil.error(response, "Error during upload", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}

		} else {
			ServletUtil.error(response, "Method must be GET or POST", HttpServletResponse.SC_METHOD_NOT_ALLOWED);
		}
	}

}
