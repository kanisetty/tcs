
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProjectStatus.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ProjectStatus"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="CAUTION"/&gt;
 *     &lt;enumeration value="CRITICAL"/&gt;
 *     &lt;enumeration value="ONTARGET"/&gt;
 *     &lt;enumeration value="PENDING"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ProjectStatus")
@XmlEnum
public enum ProjectStatus {

    CAUTION,
    CRITICAL,
    ONTARGET,
    PENDING;

    public String value() {
        return name();
    }

    public static ProjectStatus fromValue(String v) {
        return valueOf(v);
    }

}
