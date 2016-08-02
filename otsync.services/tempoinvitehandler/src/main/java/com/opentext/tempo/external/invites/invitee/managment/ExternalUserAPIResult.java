package com.opentext.tempo.external.invites.invitee.managment;

public class ExternalUserAPIResult {

    public enum ResultType{
        SUCCESS, IOERROR, VALIDATION_ERROR
    }

    public final ResultType status;
    public final String errMsg;

    public ExternalUserAPIResult(){
        this.status = ResultType.SUCCESS;
        this.errMsg = null;
    }

    public ExternalUserAPIResult(ResultType status, String errMsg){
        this.status = status;
        this.errMsg = errMsg;
    }

}
