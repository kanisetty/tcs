
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WorkItemStatus.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="WorkItemStatus"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Deleted"/&gt;
 *     &lt;enumeration value="Done"/&gt;
 *     &lt;enumeration value="Executing"/&gt;
 *     &lt;enumeration value="Finished"/&gt;
 *     &lt;enumeration value="Killed"/&gt;
 *     &lt;enumeration value="Ready"/&gt;
 *     &lt;enumeration value="ReadyBackground"/&gt;
 *     &lt;enumeration value="SendingOn"/&gt;
 *     &lt;enumeration value="Started"/&gt;
 *     &lt;enumeration value="Suspended"/&gt;
 *     &lt;enumeration value="Unknown"/&gt;
 *     &lt;enumeration value="Waiting"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "WorkItemStatus")
@XmlEnum
public enum WorkItemStatus {

    @XmlEnumValue("Deleted")
    DELETED("Deleted"),
    @XmlEnumValue("Done")
    DONE("Done"),
    @XmlEnumValue("Executing")
    EXECUTING("Executing"),
    @XmlEnumValue("Finished")
    FINISHED("Finished"),
    @XmlEnumValue("Killed")
    KILLED("Killed"),
    @XmlEnumValue("Ready")
    READY("Ready"),
    @XmlEnumValue("ReadyBackground")
    READY_BACKGROUND("ReadyBackground"),
    @XmlEnumValue("SendingOn")
    SENDING_ON("SendingOn"),
    @XmlEnumValue("Started")
    STARTED("Started"),
    @XmlEnumValue("Suspended")
    SUSPENDED("Suspended"),
    @XmlEnumValue("Unknown")
    UNKNOWN("Unknown"),
    @XmlEnumValue("Waiting")
    WAITING("Waiting");
    private final String value;

    WorkItemStatus(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static WorkItemStatus fromValue(String v) {
        for (WorkItemStatus c: WorkItemStatus.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
