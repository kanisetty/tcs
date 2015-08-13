
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProcessStatus.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ProcessStatus"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="ActivityLate"/&gt;
 *     &lt;enumeration value="Archived"/&gt;
 *     &lt;enumeration value="Completed"/&gt;
 *     &lt;enumeration value="Late"/&gt;
 *     &lt;enumeration value="MilestoneLate"/&gt;
 *     &lt;enumeration value="Ok"/&gt;
 *     &lt;enumeration value="Stopped"/&gt;
 *     &lt;enumeration value="SubProcessLate"/&gt;
 *     &lt;enumeration value="Suspended"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ProcessStatus")
@XmlEnum
public enum ProcessStatus {

    @XmlEnumValue("ActivityLate")
    ACTIVITY_LATE("ActivityLate"),
    @XmlEnumValue("Archived")
    ARCHIVED("Archived"),
    @XmlEnumValue("Completed")
    COMPLETED("Completed"),
    @XmlEnumValue("Late")
    LATE("Late"),
    @XmlEnumValue("MilestoneLate")
    MILESTONE_LATE("MilestoneLate"),
    @XmlEnumValue("Ok")
    OK("Ok"),
    @XmlEnumValue("Stopped")
    STOPPED("Stopped"),
    @XmlEnumValue("SubProcessLate")
    SUB_PROCESS_LATE("SubProcessLate"),
    @XmlEnumValue("Suspended")
    SUSPENDED("Suspended");
    private final String value;

    ProcessStatus(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ProcessStatus fromValue(String v) {
        for (ProcessStatus c: ProcessStatus.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
