
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ActivityType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ActivityType"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Milestone"/&gt;
 *     &lt;enumeration value="Normal"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ActivityType")
@XmlEnum
public enum ActivityType {

    @XmlEnumValue("Milestone")
    MILESTONE("Milestone"),
    @XmlEnumValue("Normal")
    NORMAL("Normal");
    private final String value;

    ActivityType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ActivityType fromValue(String v) {
        for (ActivityType c: ActivityType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
