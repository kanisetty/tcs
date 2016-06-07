package com.opentext.tempo.external.invites.otds;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthResponse implements Serializable {
    public AuthResponse() {
    }

    private String ticket;

    public String getTicket() {
        return ticket;
    }
}
