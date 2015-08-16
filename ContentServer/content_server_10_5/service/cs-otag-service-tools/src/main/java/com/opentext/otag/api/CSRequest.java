package com.opentext.otag.api;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.opentext.otag.rest.util.ForwardHeaders;

/**
 * To return a JSON response directly from an OTAG-style request handler in content server,
 * declare your jax-rs method to return StreamingOutput and return an instance of this
 * class.
 * 
 * The oscript-side request handler should return a complete response including headers, generally as JSON,
 * and should handle errors using HTTP status codes; if a response other than 200 is received,
 * this class' write method will throw a corresponding WebApplicationException which will be handled by jax-rs.
 *
 */
public class CSRequest implements StreamingOutput {
	public static final Log log = LogFactory.getLog(CSRequest.class);

	public static final String FUNC_PARAM_NAME = "func";
	public static final String CSTOKEN_PARAM_NAME = "cstoken";

	private static final HttpClient http = new HttpClient();

	private final String csUrl;
	private final List<NameValuePair> params;
	private final ForwardHeaders headers;

	private HttpResponse response = null;

	public CSRequest(String csUrl, String func, String cstoken, List<NameValuePair> params, ForwardHeaders headers){
		this.csUrl = csUrl;
		params.add(new BasicNameValuePair(CSTOKEN_PARAM_NAME, cstoken));
		params.add(new BasicNameValuePair(FUNC_PARAM_NAME, func));
		this.params = params;
		this.headers = headers;
	}
	
	public static void stop(){
		http.stop();
	}
	
	@Override
	public void write(OutputStream out) throws IOException, WebApplicationException {

		HttpPost request = null;
		try {
			request = http.getPostRequest(csUrl, params);
			headers.addTo(request);
			response = http.executeRaw(request, null);
			final StatusLine status = response.getStatusLine();

			if(status.getStatusCode() == HttpStatus.SC_OK){
				response.getEntity().writeTo(out);
				request = null;
				out.close();
			}
			else {
				EntityUtils.consume(response.getEntity());

				throw new WebApplicationException(Response.status(new StatusType() {
					
					@Override
					public int getStatusCode() {
						return status.getStatusCode();
					}
					
					@Override
					public String getReasonPhrase() {
						return status.getReasonPhrase();
					}
					
					@Override
					public Family getFamily() {
						return Family.CLIENT_ERROR;
					}
				}).build());
			}

		} catch (IOException e) {
			log.error("Error contacting Content Server", e);
			if(request != null) request.abort();
			throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
		}
	}

}
