
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for GroupOptions.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="GroupOptions"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="FullExpand"/&gt;
 *     &lt;enumeration value="MemberAccept"/&gt;
 *     &lt;enumeration value="MemberAcceptMaintain"/&gt;
 *     &lt;enumeration value="OneLevelExpand"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "GroupOptions")
@XmlEnum
public enum GroupOptions {

    @XmlEnumValue("FullExpand")
    FULL_EXPAND("FullExpand"),
    @XmlEnumValue("MemberAccept")
    MEMBER_ACCEPT("MemberAccept"),
    @XmlEnumValue("MemberAcceptMaintain")
    MEMBER_ACCEPT_MAINTAIN("MemberAcceptMaintain"),
    @XmlEnumValue("OneLevelExpand")
    ONE_LEVEL_EXPAND("OneLevelExpand");
    private final String value;

    GroupOptions(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static GroupOptions fromValue(String v) {
        for (GroupOptions c: GroupOptions.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
