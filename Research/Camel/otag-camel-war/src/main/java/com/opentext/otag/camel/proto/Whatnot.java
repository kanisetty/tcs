package com.opentext.otag.camel.proto;

import java.util.UUID;

/**
 * Created by Pete on 23/05/2015.
 */
public class Whatnot {
    String id;
    String name;

    public Whatnot() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
