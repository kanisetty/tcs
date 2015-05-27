package com.opentext.otag.camel.proto;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

/**
 * Created by Pete on 23/05/2015.
 */
public class WhatnotService {

    private final Map<String, Whatnot> whatnots = new TreeMap<>();

    public Whatnot getWhatnot(String id) {
        return whatnots.get(id);
    }

    public Collection<Whatnot> listWhatnots() {
        return whatnots.values();
    }

    public String updateWhatnot(Whatnot whatnot) {
        if (whatnot == null) return "{}";
        whatnots.put(whatnot.getId(), whatnot);
        return whatnot.getId();
    }
}
