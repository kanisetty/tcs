
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchColumn.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SearchColumn"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="FIRSTNAME"/&gt;
 *     &lt;enumeration value="LASTNAME"/&gt;
 *     &lt;enumeration value="MAILADDRESS"/&gt;
 *     &lt;enumeration value="NAME"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SearchColumn")
@XmlEnum
public enum SearchColumn {

    FIRSTNAME,
    LASTNAME,
    MAILADDRESS,
    NAME;

    public String value() {
        return name();
    }

    public static SearchColumn fromValue(String v) {
        return valueOf(v);
    }

}
