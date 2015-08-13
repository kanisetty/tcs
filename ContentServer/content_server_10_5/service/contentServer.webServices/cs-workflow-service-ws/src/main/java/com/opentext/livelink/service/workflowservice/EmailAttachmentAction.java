
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EmailAttachmentAction.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="EmailAttachmentAction"&gt;
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string"&gt;
 *     &lt;enumeration value="EmailAsFile"/&gt;
 *     &lt;enumeration value="EmailAsLink"/&gt;
 *     &lt;enumeration value="NotSet"/&gt;
 *   &lt;/restriction&gt;
 * &lt;/simpleType&gt;
 * </pre>
 * 
 */
@XmlType(name = "EmailAttachmentAction")
@XmlEnum
public enum EmailAttachmentAction {

    @XmlEnumValue("EmailAsFile")
    EMAIL_AS_FILE("EmailAsFile"),
    @XmlEnumValue("EmailAsLink")
    EMAIL_AS_LINK("EmailAsLink"),
    @XmlEnumValue("NotSet")
    NOT_SET("NotSet");
    private final String value;

    EmailAttachmentAction(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static EmailAttachmentAction fromValue(String v) {
        for (EmailAttachmentAction c: EmailAttachmentAction.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
