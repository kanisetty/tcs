
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for MonthFormat.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="MonthFormat"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="FULLNAME"/&gt;
 *     &lt;enumeration value="THREECHAR"/&gt;
 *     &lt;enumeration value="TWODIGIT"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "MonthFormat")
@XmlEnum
public enum MonthFormat {

    FULLNAME,
    THREECHAR,
    TWODIGIT;

    public String value() {
        return name();
    }

    public static MonthFormat fromValue(String v) {
        return valueOf(v);
    }

}
