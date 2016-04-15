package com.opentext.otsync.connector.auth;

import com.opentext.otag.sdk.types.v3.auth.AuthHandlerResult;
import com.opentext.otag.sdk.util.Cookie;

import java.util.Map;

public class FailedAuthHandlerResult extends AuthHandlerResult {

    public FailedAuthHandlerResult() {
        super();
    }

    public FailedAuthHandlerResult(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public boolean isSuccess() {
        return false;
    }

    @Override
    public boolean isAdmin() {
        return false;
    }

    @Override
    public String getErrorMessage() {
        return errorMessage;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public Map<String, Cookie> getCookies() {
        return null;
    }

    @Override
    public void addRootCookie(String name, String value) {
    }

    @Override
    public void addHttpOnlyRootCookie(String name, String value, String domain) {
    }

}
