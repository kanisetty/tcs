package com.opentext.otag.camel.proto;

/**
 * Created by Pete on 23/05/2015.
 */
public class ProxyRoute {
    String match;
    String replace;
    String id;

    public ProxyRoute(String match, String replace) {
        this.match = match;
        this.replace = replace;
    }

    public ProxyRoute() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProxyRoute that = (ProxyRoute) o;

        if (match != null ? !match.equals(that.match) : that.match != null) return false;
        if (replace != null ? !replace.equals(that.replace) : that.replace != null) return false;
        return !(id != null ? !id.equals(that.id) : that.id != null);

    }

    @Override
    public int hashCode() {
        int result = match != null ? match.hashCode() : 0;
        result = 31 * result + (replace != null ? replace.hashCode() : 0);
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }

    public String getMatch() {
        return match;
    }

    public void setMatch(String match) {
        this.match = match;
    }

    public String getReplace() { return replace; }

    public void setReplace(String replace) {
        this.replace = replace;
    }

    public void setId(String id) { this.id = id; }

    public String getId() { return id; }
}
