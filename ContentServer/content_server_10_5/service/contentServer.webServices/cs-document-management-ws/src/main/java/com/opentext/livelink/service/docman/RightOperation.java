
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for RightOperation.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="RightOperation"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Add"/&gt;
 *     &lt;enumeration value="AddReplace"/&gt;
 *     &lt;enumeration value="Delete"/&gt;
 *     &lt;enumeration value="Replace"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "RightOperation")
@XmlEnum
public enum RightOperation {

    @XmlEnumValue("Add")
    ADD("Add"),
    @XmlEnumValue("AddReplace")
    ADD_REPLACE("AddReplace"),
    @XmlEnumValue("Delete")
    DELETE("Delete"),
    @XmlEnumValue("Replace")
    REPLACE("Replace");
    private final String value;

    RightOperation(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static RightOperation fromValue(String v) {
        for (RightOperation c: RightOperation.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
