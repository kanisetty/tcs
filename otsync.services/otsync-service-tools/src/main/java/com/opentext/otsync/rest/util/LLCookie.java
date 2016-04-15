package com.opentext.otsync.rest.util;

import com.opentext.otag.sdk.util.Cookie;
import org.apache.http.client.CookieStore;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.cookie.BasicClientCookie;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public class LLCookie {
    public static final String CS_COOKIE_NAME = "LLCookie";
    private BasicClientCookie llCookie;

    public LLCookie(HttpServletRequest request){

        String authCookie = getLLCookieValueFromRequest(request);
        llCookie = new BasicClientCookie(CS_COOKIE_NAME, authCookie);
    }

    public LLCookie(Map<String, Cookie> cookies){

        String authCookie = getLLCookieValueFromMap(cookies);
        llCookie = new BasicClientCookie(CS_COOKIE_NAME, authCookie);
    }

    public void addLLCookieToRequest(DefaultHttpClient httpClient, HttpUriRequest outgoing){
        llCookie.setPath("/");
        llCookie.setDomain(outgoing.getURI().getHost());

        CookieStore cookieJar = httpClient.getCookieStore();
        cookieJar.addCookie(llCookie);
        httpClient.setCookieStore(cookieJar);
    }

    private String getLLCookieValueFromMap(Map<String, Cookie> cookies){
        String llCookieValue = null;

        if (cookies != null){
            Cookie llCookie = cookies.get(CS_COOKIE_NAME);

            if (llCookie != null){
                llCookieValue = llCookie.getValue();
            }
        }

        return llCookieValue;
    }

    private String getLLCookieValueFromRequest(HttpServletRequest request){
        javax.servlet.http.Cookie[] cookies = request.getCookies();

        if (cookies == null)
            return null;

        for (javax.servlet.http.Cookie cookie : cookies) {
            if (cookie.getName().equals(CS_COOKIE_NAME))
                return cookie.getValue();
        }

        return null;
    }
}
