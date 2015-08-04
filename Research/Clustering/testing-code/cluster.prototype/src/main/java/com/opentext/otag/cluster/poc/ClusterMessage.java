package com.opentext.otag.cluster.poc;

import java.io.Serializable;

public class ClusterMessage implements Serializable {

    private String payload;

    public ClusterMessage() {
    }

    public ClusterMessage(String payload) {
        this.payload = payload;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "ClusterMessage{" +
                "payload='" + payload + '\'' +
                '}';
    }

}
