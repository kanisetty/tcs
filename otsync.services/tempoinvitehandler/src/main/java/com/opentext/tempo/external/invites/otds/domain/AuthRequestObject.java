package com.opentext.tempo.external.invites.otds.domain;

import java.io.Serializable;

public class AuthRequestObject implements Serializable {

    private String userName;
    private String password;

    public AuthRequestObject() {
    }

    public AuthRequestObject(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "AuthRequestObject{" +
                "userName='" + userName + '\'' +
                ", password='" + "*****" + '\'' +
                '}';
    }
}
