
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProjectRole.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ProjectRole"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="COORDINATOR"/&gt;
 *     &lt;enumeration value="GUEST"/&gt;
 *     &lt;enumeration value="MEMBER"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ProjectRole")
@XmlEnum
public enum ProjectRole {

    COORDINATOR,
    GUEST,
    MEMBER;

    public String value() {
        return name();
    }

    public static ProjectRole fromValue(String v) {
        return valueOf(v);
    }

}
