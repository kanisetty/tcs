package com.opentext.tempo.external.invites.api;

/**
 * This Exception represents 503 status. If the service settings have not been added
 * to allow us to do things like connect to the database, or talk to Content Server
 * or OTDS then we consider the service UNAVAILABLE.
 */
public class ServiceNotReadyException extends RuntimeException {

    public ServiceNotReadyException() {
    }

    public ServiceNotReadyException(String message) {
        super(message);
    }

    public ServiceNotReadyException(String message, Throwable cause) {
        super(message, cause);
    }

    public ServiceNotReadyException(Throwable cause) {
        super(cause);
    }

    public ServiceNotReadyException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
