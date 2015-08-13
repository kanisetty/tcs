
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for SearchFilter.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="SearchFilter"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="All"/&gt;
 *     &lt;enumeration value="Initiated"/&gt;
 *     &lt;enumeration value="Managed"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "SearchFilter")
@XmlEnum
public enum SearchFilter {

    @XmlEnumValue("All")
    ALL("All"),
    @XmlEnumValue("Initiated")
    INITIATED("Initiated"),
    @XmlEnumValue("Managed")
    MANAGED("Managed");
    private final String value;

    SearchFilter(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static SearchFilter fromValue(String v) {
        for (SearchFilter c: SearchFilter.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
