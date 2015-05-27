package com.opentext.otag.camel.proto;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

/**
 * Created by Pete on 22/05/2015.
 */
public class DoodadService {

    private final Map<String, Doodad> doodads = new TreeMap<String, Doodad>();

    public Doodad getDoodad(String id) {
        return doodads.get(id);
    }

    public Collection<Doodad> listDoodads() {
        return doodads.values();
    }

    public String updateDoodad(Doodad doodad) {
        if (doodad == null) return "{}";
        doodads.put(doodad.getId(), doodad);
        return doodad.getId();
    }

}
