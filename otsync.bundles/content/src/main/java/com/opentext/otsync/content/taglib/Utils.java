package com.opentext.otsync.content.taglib;

import org.apache.commons.lang3.StringEscapeUtils;

public class Utils{


	public static String escape2JSString( String value, Integer maxLength ){

			String returnValue;

			returnValue = trunc(value,maxLength);
			returnValue = StringEscapeUtils.escapeEcmaScript(returnValue);

			return returnValue;
	}

	public static Integer escape2JSInteger( String value ){

		Integer returnValue;

		try{

			returnValue = Integer.parseInt(value);

		}catch(NumberFormatException exception){

			returnValue = 0;
		}
		return returnValue;
	}

	public static String escape2HTMLString( String value ) {

		String returnValue;

		returnValue = trunc(value,250);
		returnValue = StringEscapeUtils.escapeHtml4(returnValue);

		return returnValue;
	}

	public static String trunc( String value, Integer maxLength ){

		String returnValue = value;

		if (returnValue != null && returnValue.length() > maxLength){

		    returnValue = returnValue.substring(0, maxLength);
		}

		return returnValue;
	}
}
