
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WorkItemDetails complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WorkItemDetails"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Actions" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemActions" minOccurs="0"/&gt;
 *         &lt;element name="ApplicationData" type="{urn:WorkflowService.service.livelink.opentext.com}ApplicationData" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="Instructions" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WorkItemDetails", propOrder = {
    "actions",
    "applicationData",
    "instructions"
})
public class WorkItemDetails
    extends ServiceDataObject
{

    @XmlElement(name = "Actions")
    protected WorkItemActions actions;
    @XmlElement(name = "ApplicationData")
    protected List<ApplicationData> applicationData;
    @XmlElement(name = "Instructions")
    protected String instructions;

    /**
     * Gets the value of the actions property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemActions }
     *     
     */
    public WorkItemActions getActions() {
        return actions;
    }

    /**
     * Sets the value of the actions property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemActions }
     *     
     */
    public void setActions(WorkItemActions value) {
        this.actions = value;
    }

    /**
     * Gets the value of the applicationData property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the applicationData property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getApplicationData().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ApplicationData }
     * 
     * 
     */
    public List<ApplicationData> getApplicationData() {
        if (applicationData == null) {
            applicationData = new ArrayList<ApplicationData>();
        }
        return this.applicationData;
    }

    /**
     * Gets the value of the instructions property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInstructions() {
        return instructions;
    }

    /**
     * Sets the value of the instructions property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInstructions(String value) {
        this.instructions = value;
    }

}
