
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ActivitySubtype.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ActivitySubtype"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Conditional"/&gt;
 *     &lt;enumeration value="Initiator"/&gt;
 *     &lt;enumeration value="ItemHandler"/&gt;
 *     &lt;enumeration value="Milestone"/&gt;
 *     &lt;enumeration value="Process"/&gt;
 *     &lt;enumeration value="StartStep"/&gt;
 *     &lt;enumeration value="Subprocess"/&gt;
 *     &lt;enumeration value="Unknown"/&gt;
 *     &lt;enumeration value="User"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ActivitySubtype")
@XmlEnum
public enum ActivitySubtype {

    @XmlEnumValue("Conditional")
    CONDITIONAL("Conditional"),
    @XmlEnumValue("Initiator")
    INITIATOR("Initiator"),
    @XmlEnumValue("ItemHandler")
    ITEM_HANDLER("ItemHandler"),
    @XmlEnumValue("Milestone")
    MILESTONE("Milestone"),
    @XmlEnumValue("Process")
    PROCESS("Process"),
    @XmlEnumValue("StartStep")
    START_STEP("StartStep"),
    @XmlEnumValue("Subprocess")
    SUBPROCESS("Subprocess"),
    @XmlEnumValue("Unknown")
    UNKNOWN("Unknown"),
    @XmlEnumValue("User")
    USER("User");
    private final String value;

    ActivitySubtype(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ActivitySubtype fromValue(String v) {
        for (ActivitySubtype c: ActivitySubtype.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
