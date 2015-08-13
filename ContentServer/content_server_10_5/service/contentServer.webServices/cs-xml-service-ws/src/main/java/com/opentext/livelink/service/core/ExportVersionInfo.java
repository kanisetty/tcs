
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ExportVersionInfo.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ExportVersionInfo"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="All"/&gt;
 *     &lt;enumeration value="Current"/&gt;
 *     &lt;enumeration value="NotSet"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ExportVersionInfo")
@XmlEnum
public enum ExportVersionInfo {

    @XmlEnumValue("All")
    ALL("All"),
    @XmlEnumValue("Current")
    CURRENT("Current"),
    @XmlEnumValue("NotSet")
    NOT_SET("NotSet");
    private final String value;

    ExportVersionInfo(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ExportVersionInfo fromValue(String v) {
        for (ExportVersionInfo c: ExportVersionInfo.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
