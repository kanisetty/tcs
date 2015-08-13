
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ExportContent.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ExportContent"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="Base64"/&gt;
 *     &lt;enumeration value="CData"/&gt;
 *     &lt;enumeration value="NotSet"/&gt;
 *     &lt;enumeration value="Plain"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ExportContent")
@XmlEnum
public enum ExportContent {

    @XmlEnumValue("Base64")
    BASE_64("Base64"),
    @XmlEnumValue("CData")
    C_DATA("CData"),
    @XmlEnumValue("NotSet")
    NOT_SET("NotSet"),
    @XmlEnumValue("Plain")
    PLAIN("Plain");
    private final String value;

    ExportContent(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ExportContent fromValue(String v) {
        for (ExportContent c: ExportContent.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
