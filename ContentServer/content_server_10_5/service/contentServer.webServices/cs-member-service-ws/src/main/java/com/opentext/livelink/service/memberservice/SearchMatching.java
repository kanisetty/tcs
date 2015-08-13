
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchMatching.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SearchMatching"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="CONTAINS"/&gt;
 *     &lt;enumeration value="ENDSWITH"/&gt;
 *     &lt;enumeration value="SOUNDSLIKE"/&gt;
 *     &lt;enumeration value="STARTSWITH"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SearchMatching")
@XmlEnum
public enum SearchMatching {

    CONTAINS,
    ENDSWITH,
    SOUNDSLIKE,
    STARTSWITH;

    public String value() {
        return name();
    }

    public static SearchMatching fromValue(String v) {
        return valueOf(v);
    }

}
