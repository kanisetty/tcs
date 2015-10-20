package com.opentext.otag.api;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Response.Status.Family;
import javax.ws.rs.core.Response.StatusType;
import javax.ws.rs.core.StreamingOutput;

import com.opentext.otag.api.shared.util.ForwardHeaders;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class CSMultiPartRequest implements StreamingOutput {
	public static final Log log = LogFactory.getLog(CSRequest.class);

	public static final String FUNC_PARAM_NAME = "func";

	private static final HttpClient http = new HttpClient();

	private final String csUrl;
	private final List<NameValuePair> params;
	private final ForwardHeaders headers;
	private final InputStream fileStream;
	private final String filePartName;
	private final String filename;

	private HttpResponse response = null;


	public CSMultiPartRequest(String csUrl, String func, List<NameValuePair> params,
			InputStream fileStream, String filePartName, String filename,
			ForwardHeaders headers){

		params.add(new BasicNameValuePair(FUNC_PARAM_NAME, func));
		this.csUrl = csUrl;
		this.params = params;
		this.headers = headers;
		this.fileStream = fileStream;
		this.filePartName = filePartName;
		this.filename = filename;
	}
	
	public static void stop(){
		http.stop();
	}
	
	@Override
	public void write(OutputStream out) throws IOException, WebApplicationException {

		HttpPost request = null;
		FileInputStream localIn = null;
		File tmpFile = new File(getTmpFilePath());
		try {
			// Since we need the file size (which Jersey doesn't report correctly), we write to a temporary file then stream our upload from there
			saveToFile(fileStream, tmpFile);
			long fileSize = tmpFile.length();
			localIn = new FileInputStream(tmpFile);
			
			request = http.getMultipartPostRequest(
					csUrl,
					localIn,
					params,
					filePartName,
					filename,
					fileSize);
			
			headers.addTo(request);
			
			// for SEA compatibility, we must include the llcookie
			//TODO: test that this is still required
			// request.addHeader("Cookie", CS_COOKIE_NAME + "=" + cstoken);
			
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
			if(request != null)
				request.abort();
			throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
			
		} finally {
			if(localIn != null) localIn.close();
			if(tmpFile.exists())
				if (!tmpFile.delete())
					log.warn("Failed to delete temp file after the response was written");
		}
	}

	private String getTmpFilePath() {
		String tmpFileDirPath = System.getProperty("catalina.base") + "/otagfiletmp/";
		File tmpFileDir = new File(tmpFileDirPath);
		if(!tmpFileDir.exists())
			if(!tmpFileDir.mkdir())
				log.warn("Failed to create temp file dir - " + tmpFileDirPath);

		return tmpFileDirPath + System.currentTimeMillis();
	}

	private void saveToFile(InputStream inputStream, File tmpFile) throws IOException {
		FileOutputStream localOut = null;
		try {
			localOut = new FileOutputStream(tmpFile);
			IOUtils.copy(inputStream, localOut);
		} finally {
			inputStream.close();
			if(localOut != null) localOut.close();
		}
	}

}
