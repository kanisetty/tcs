
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.docman.AttributeGroupDefinition;


/**
 * <p>Java class for AttributeData complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="AttributeData"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ApplicationData"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Attributes" type="{urn:DocMan.service.livelink.opentext.com}AttributeGroupDefinition" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "AttributeData", propOrder = {
    "attributes"
})
public class AttributeData
    extends ApplicationData
{

    @XmlElement(name = "Attributes")
    protected AttributeGroupDefinition attributes;

    /**
     * Gets the value of the attributes property.
     * 
     * @return
     *     possible object is
     *     {@link AttributeGroupDefinition }
     *     
     */
    public AttributeGroupDefinition getAttributes() {
        return attributes;
    }

    /**
     * Sets the value of the attributes property.
     * 
     * @param value
     *     allowed object is
     *     {@link AttributeGroupDefinition }
     *     
     */
    public void setAttributes(AttributeGroupDefinition value) {
        this.attributes = value;
    }

}
