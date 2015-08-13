
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TransitionType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TransitionType"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="False"/&gt;
 *     &lt;enumeration value="Loop"/&gt;
 *     &lt;enumeration value="Standard"/&gt;
 *     &lt;enumeration value="True"/&gt;
 *     &lt;enumeration value="Unknown"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "TransitionType")
@XmlEnum
public enum TransitionType {

    @XmlEnumValue("False")
    FALSE("False"),
    @XmlEnumValue("Loop")
    LOOP("Loop"),
    @XmlEnumValue("Standard")
    STANDARD("Standard"),
    @XmlEnumValue("True")
    TRUE("True"),
    @XmlEnumValue("Unknown")
    UNKNOWN("Unknown");
    private final String value;

    TransitionType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TransitionType fromValue(String v) {
        for (TransitionType c: TransitionType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
