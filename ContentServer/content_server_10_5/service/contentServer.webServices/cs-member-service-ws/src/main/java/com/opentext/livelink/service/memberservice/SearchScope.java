
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchScope.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SearchScope"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="GROUP"/&gt;
 *     &lt;enumeration value="SYSTEM"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SearchScope")
@XmlEnum
public enum SearchScope {

    GROUP,
    SYSTEM;

    public String value() {
        return name();
    }

    public static SearchScope fromValue(String v) {
        return valueOf(v);
    }

}
