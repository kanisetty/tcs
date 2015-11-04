package com.opentext.ecm.otsync.ws.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * This class represents a version of a client, allowing for version comparison
 */
public class ClientVersion {

    private static final Log LOG = LogFactory.getLog(ClientVersion.class);

    private String versionString;
    private Integer majorVersion = 0;
    private Integer minorVersion = 0;
    private Integer updateNumber = 0;
    private Integer patchLevel = 0;

    public ClientVersion(String version) {
        versionString = version;

        if (version != null) {
            String[] versionElements = version.split("\\.");

            try {

                if (versionElements.length > 0) {
                    majorVersion = new Integer(versionElements[0]);
                }

                if (versionElements.length > 1) {
                    minorVersion = new Integer(versionElements[1]);
                }

                if (versionElements.length > 2) {
                    updateNumber = new Integer(versionElements[2]);
                }

                if (versionElements.length > 3) {
                    patchLevel = new Integer(versionElements[3]);
                }
            } catch (NumberFormatException e) {
                //An invalid version has been entered, default to 0.0.0.0
                LOG.error("Invalid client version specified:" + version);
                LOG.error(e);
            }
        }
    }

    public String getVersion() {
        return versionString;
    }

    public Integer getMajor() {
        return majorVersion;
    }

    public Integer getMinor() {
        return minorVersion;
    }

    public Integer getUpdate() {
        return updateNumber;
    }

    public Integer getPatch() {
        return patchLevel;
    }

    /*
     * Will return TRUE iff version is lower than this.version
     * 
     * @param version (String) - the version to compare against
     */
    public boolean isLesser(String version) {
        ClientVersion cv = new ClientVersion(version);

        return this.isLesser(cv);
    }

    /*
     * Will return TRUE iff version is lower than this.version
     * 
     * @param version (ClientVersion) - the version to compare against
     */
    public boolean isLesser(ClientVersion version) {

        if (version.getMajor() < this.majorVersion) {
            return true;
        }
        if (version.getMajor() <= this.majorVersion &&
                version.getMinor() < this.minorVersion) {
            return true;
        }
        if (version.getMajor() <= this.majorVersion &&
                version.getMinor() <= this.minorVersion &&
                version.getUpdate() < this.updateNumber) {
            return true;
        }
        if (version.getMajor() <= this.majorVersion &&
                version.getMinor() <= this.minorVersion &&
                version.getUpdate() <= this.updateNumber &&
                version.getPatch() < this.patchLevel) {
            return true;
        }


        return false;
    }

}
