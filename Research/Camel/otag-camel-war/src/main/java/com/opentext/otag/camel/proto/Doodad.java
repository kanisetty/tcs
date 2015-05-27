package com.opentext.otag.camel.proto;

import java.util.UUID;

/**
 * Created by Pete on 22/05/2015.
 */
public class Doodad {

    String id;
    String name;

    public Doodad() {
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
