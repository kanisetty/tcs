package com.opentext.ecm.otsync.ws.server.servlet3;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.opentext.ecm.otsync.http.ContentServiceHttpClient;
import com.opentext.ecm.otsync.ws.ServletUtil;
import com.opentext.ecm.otsync.ws.server.AbstractOTSyncServlet;

@SuppressWarnings("serial")
public class OTSyncServer extends AbstractOTSyncServlet {
	// TODO FIXME this is really weird, why not just get rid of the private vars and keep the
	// statics, or why not just implement a service type singleton if they are used globally like this!!!

	private Servlet3BackChannel backChannel;
	private Servlet3FrontChannel frontChannel;
	private Servlet3ContentChannel contentChannel;
	private Servlet3ChunkedContentChannel chunkedContentChannel;
      
	public static Log log = LogFactory.getLog(OTSyncServer.class);
	private static Servlet3FrontChannel globalFrontChannel;
	private static Servlet3ContentChannel globalContentChannel;
	private static Servlet3BackChannel globalBackChannel;
	private static ContentServiceHttpClient globalServerConnection;
      
	/** 
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {		
       
		try{
			
			if (ServletUtil.isFrontChannelRequest(request)) {
				frontChannel.handle(request);
			}
			else if (ServletUtil.isBackChannelRequest(request)) {
				backChannel.handle(request, response);
			}
			else if (ServletUtil.isContentChannelRequest(request)) {
				contentChannel.handle(request, response);
			}
			else if (ServletUtil.isChunkedContentChannelRequest(request)) {
				chunkedContentChannel.handle(request, response);
			}
		}catch(Throwable te){
			
			log.error(te);
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "OTSyncServer Reported Error:"+te.getClass().getSimpleName() );
		}
             
	} 

	/** 
	 * Handles the HTTP <code>GET</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		processRequest(request, response);
	} 

	/** 
	 * Handles the HTTP <code>POST</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		processRequest(request, response);
	}

	/*
	 * This is where we'd read in all our params
	 * (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	@Override
	public void init(javax.servlet.ServletConfig config) throws ServletException
	{
		super.init(config);
		
		backChannel = new Servlet3BackChannel(messageConverter);
		frontChannel = new Servlet3FrontChannel(sharedThreadPool, messageConverter, messageHandler);
		contentChannel = new Servlet3ContentChannel(serverConnection, sharedThreadPool);  
		chunkedContentChannel = new Servlet3ChunkedContentChannel(chunkedContentRequestQueue);
		
		// set static references to our channels so other (REST api) servlets can use them
		setGlobalFrontChannel(frontChannel);
		setGlobalBackChannel(backChannel);
		setGlobalContentChannel(contentChannel);
		setGlobalServerConnection(serverConnection);
	}

	//  TODO FIXME very strange, why have two members of the same class refer to the same thing like this
	// if you expose the instance via a static method encapsulation is automatically broken???

	private static void setGlobalFrontChannel(Servlet3FrontChannel currentFrontChannel) {
		globalFrontChannel = currentFrontChannel;
	}
	
	public static Servlet3FrontChannel getFrontChannel(){
		return globalFrontChannel;
	}
	
	public static Servlet3BackChannel getBackChannel() {
		return globalBackChannel;
	}

	public static void setGlobalBackChannel(Servlet3BackChannel currentBackChannel) {
		globalBackChannel = currentBackChannel;
	}

	private static void setGlobalContentChannel(Servlet3ContentChannel currentContentChannel) {
		globalContentChannel = currentContentChannel;
	}
	
	public static Servlet3ContentChannel getContentChannel(){
		return globalContentChannel;
	}
	
	private static void setGlobalServerConnection(ContentServiceHttpClient currentServerConnection){
		globalServerConnection = currentServerConnection;
	}
	
	public static ContentServiceHttpClient getServerConnection(){
		return globalServerConnection;
	}
}
