
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WorkItemPriorityObject complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WorkItemPriorityObject"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Value" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemPriority"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WorkItemPriorityObject", propOrder = {
    "value"
})
public class WorkItemPriorityObject
    extends ServiceDataObject
{

    @XmlElement(name = "Value", required = true)
    @XmlSchemaType(name = "string")
    protected WorkItemPriority value;

    /**
     * Gets the value of the value property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemPriority }
     *     
     */
    public WorkItemPriority getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemPriority }
     *     
     */
    public void setValue(WorkItemPriority value) {
        this.value = value;
    }

}
