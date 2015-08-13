
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ActionOnComplete.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ActionOnComplete"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="ArchiveOnComplete"/&gt;
 *     &lt;enumeration value="DeleteOnComplete"/&gt;
 *     &lt;enumeration value="NotSet"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ActionOnComplete")
@XmlEnum
public enum ActionOnComplete {

    @XmlEnumValue("ArchiveOnComplete")
    ARCHIVE_ON_COMPLETE("ArchiveOnComplete"),
    @XmlEnumValue("DeleteOnComplete")
    DELETE_ON_COMPLETE("DeleteOnComplete"),
    @XmlEnumValue("NotSet")
    NOT_SET("NotSet");
    private final String value;

    ActionOnComplete(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ActionOnComplete fromValue(String v) {
        for (ActionOnComplete c: ActionOnComplete.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
