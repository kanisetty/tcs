
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for AttributeSourceType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="AttributeSourceType"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="DESTINATION"/&gt;
 *     &lt;enumeration value="MERGE"/&gt;
 *     &lt;enumeration value="ORIGINAL"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "AttributeSourceType")
@XmlEnum
public enum AttributeSourceType {

    DESTINATION,
    MERGE,
    ORIGINAL;

    public String value() {
        return name();
    }

    public static AttributeSourceType fromValue(String v) {
        return valueOf(v);
    }

}
