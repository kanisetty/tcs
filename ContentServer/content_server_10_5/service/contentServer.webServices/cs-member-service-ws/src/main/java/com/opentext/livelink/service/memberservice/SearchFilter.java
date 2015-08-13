
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchFilter.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SearchFilter"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="ANY"/&gt;
 *     &lt;enumeration value="DOMAIN"/&gt;
 *     &lt;enumeration value="GROUP"/&gt;
 *     &lt;enumeration value="USER"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SearchFilter")
@XmlEnum
public enum SearchFilter {

    ANY,
    DOMAIN,
    GROUP,
    USER;

    public String value() {
        return name();
    }

    public static SearchFilter fromValue(String v) {
        return valueOf(v);
    }

}
