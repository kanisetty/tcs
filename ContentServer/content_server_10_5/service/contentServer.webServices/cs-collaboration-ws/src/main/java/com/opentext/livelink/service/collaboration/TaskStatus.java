
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TaskStatus.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TaskStatus"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="CANCELLED"/&gt;
 *     &lt;enumeration value="COMPLETED"/&gt;
 *     &lt;enumeration value="INPROCESS"/&gt;
 *     &lt;enumeration value="ISSUE"/&gt;
 *     &lt;enumeration value="ONHOLD"/&gt;
 *     &lt;enumeration value="PENDING"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "TaskStatus")
@XmlEnum
public enum TaskStatus {

    CANCELLED,
    COMPLETED,
    INPROCESS,
    ISSUE,
    ONHOLD,
    PENDING;

    public String value() {
        return name();
    }

    public static TaskStatus fromValue(String v) {
        return valueOf(v);
    }

}
