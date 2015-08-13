
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="processID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="subProcessID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="activityID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="groupID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="instructions" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="duration" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="priority" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemPriority"/&gt;
 *         &lt;element name="groupOptions" type="{urn:WorkflowService.service.livelink.opentext.com}GroupOptions"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "processID",
    "subProcessID",
    "activityID",
    "groupID",
    "title",
    "instructions",
    "duration",
    "priority",
    "groupOptions"
})
@XmlRootElement(name = "SendWorkItemForGroupReview")
public class SendWorkItemForGroupReview {

    protected long processID;
    protected long subProcessID;
    protected int activityID;
    protected long groupID;
    protected String title;
    protected String instructions;
    protected int duration;
    @XmlElement(required = true)
    @XmlSchemaType(name = "string")
    protected WorkItemPriority priority;
    @XmlElement(required = true)
    @XmlSchemaType(name = "string")
    protected GroupOptions groupOptions;

    /**
     * Gets the value of the processID property.
     * 
     */
    public long getProcessID() {
        return processID;
    }

    /**
     * Sets the value of the processID property.
     * 
     */
    public void setProcessID(long value) {
        this.processID = value;
    }

    /**
     * Gets the value of the subProcessID property.
     * 
     */
    public long getSubProcessID() {
        return subProcessID;
    }

    /**
     * Sets the value of the subProcessID property.
     * 
     */
    public void setSubProcessID(long value) {
        this.subProcessID = value;
    }

    /**
     * Gets the value of the activityID property.
     * 
     */
    public int getActivityID() {
        return activityID;
    }

    /**
     * Sets the value of the activityID property.
     * 
     */
    public void setActivityID(int value) {
        this.activityID = value;
    }

    /**
     * Gets the value of the groupID property.
     * 
     */
    public long getGroupID() {
        return groupID;
    }

    /**
     * Sets the value of the groupID property.
     * 
     */
    public void setGroupID(long value) {
        this.groupID = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
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

    /**
     * Gets the value of the duration property.
     * 
     */
    public int getDuration() {
        return duration;
    }

    /**
     * Sets the value of the duration property.
     * 
     */
    public void setDuration(int value) {
        this.duration = value;
    }

    /**
     * Gets the value of the priority property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemPriority }
     *     
     */
    public WorkItemPriority getPriority() {
        return priority;
    }

    /**
     * Sets the value of the priority property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemPriority }
     *     
     */
    public void setPriority(WorkItemPriority value) {
        this.priority = value;
    }

    /**
     * Gets the value of the groupOptions property.
     * 
     * @return
     *     possible object is
     *     {@link GroupOptions }
     *     
     */
    public GroupOptions getGroupOptions() {
        return groupOptions;
    }

    /**
     * Sets the value of the groupOptions property.
     * 
     * @param value
     *     allowed object is
     *     {@link GroupOptions }
     *     
     */
    public void setGroupOptions(GroupOptions value) {
        this.groupOptions = value;
    }

}
