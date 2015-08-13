
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for YearFormat.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="YearFormat"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="FOURDIGIT"/&gt;
 *     &lt;enumeration value="TWODIGIT"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "YearFormat")
@XmlEnum
public enum YearFormat {

    FOURDIGIT,
    TWODIGIT;

    public String value() {
        return name();
    }

    public static YearFormat fromValue(String v) {
        return valueOf(v);
    }

}
