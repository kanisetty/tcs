
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ExportScope.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ExportScope"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Base"/&gt;
 *     &lt;enumeration value="One"/&gt;
 *     &lt;enumeration value="Sub"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ExportScope")
@XmlEnum
public enum ExportScope {

    @XmlEnumValue("Base")
    BASE("Base"),
    @XmlEnumValue("One")
    ONE("One"),
    @XmlEnumValue("Sub")
    SUB("Sub");
    private final String value;

    ExportScope(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ExportScope fromValue(String v) {
        for (ExportScope c: ExportScope.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
