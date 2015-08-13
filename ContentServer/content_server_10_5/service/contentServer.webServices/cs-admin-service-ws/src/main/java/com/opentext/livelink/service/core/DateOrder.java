
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DateOrder.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="DateOrder"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="DDMMYY"/&gt;
 *     &lt;enumeration value="DDYYMM"/&gt;
 *     &lt;enumeration value="MMDDYY"/&gt;
 *     &lt;enumeration value="MMYYDD"/&gt;
 *     &lt;enumeration value="YYDDMM"/&gt;
 *     &lt;enumeration value="YYMMDD"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "DateOrder")
@XmlEnum
public enum DateOrder {

    DDMMYY,
    DDYYMM,
    MMDDYY,
    MMYYDD,
    YYDDMM,
    YYMMDD;

    public String value() {
        return name();
    }

    public static DateOrder fromValue(String v) {
        return valueOf(v);
    }

}
