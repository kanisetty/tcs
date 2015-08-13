
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProjectRoleAction.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ProjectRoleAction"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="ASSIGN"/&gt;
 *     &lt;enumeration value="REMOVE"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "ProjectRoleAction")
@XmlEnum
public enum ProjectRoleAction {

    ASSIGN,
    REMOVE;

    public String value() {
        return name();
    }

    public static ProjectRoleAction fromValue(String v) {
        return valueOf(v);
    }

}
