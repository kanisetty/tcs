
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;
import com.opentext.livelink.service.core.IntegerObject;
import com.opentext.livelink.service.core.StringObject;


/**
 * <p>Java class for WorkItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WorkItem"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="DueDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="GroupActivity" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="InitiatorID" type="{urn:Core.service.livelink.opentext.com}IntegerObject" minOccurs="0"/&gt;
 *         &lt;element name="MemberID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="MilestoneDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Priority" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemPriorityObject" minOccurs="0"/&gt;
 *         &lt;element name="ProcessID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ProcessStatus" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessStatusObject" minOccurs="0"/&gt;
 *         &lt;element name="ProcessTitle" type="{urn:Core.service.livelink.opentext.com}StringObject" minOccurs="0"/&gt;
 *         &lt;element name="ReadyDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Status" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemStatus"/&gt;
 *         &lt;element name="SubProcessID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WorkItem", propOrder = {
    "dueDate",
    "groupActivity",
    "id",
    "initiatorID",
    "memberID",
    "milestoneDate",
    "priority",
    "processID",
    "processStatus",
    "processTitle",
    "readyDate",
    "status",
    "subProcessID",
    "title"
})
public class WorkItem
    extends ServiceDataObject
{

    @XmlElement(name = "DueDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dueDate;
    @XmlElement(name = "GroupActivity")
    protected boolean groupActivity;
    @XmlElement(name = "ID")
    protected int id;
    @XmlElement(name = "InitiatorID")
    protected IntegerObject initiatorID;
    @XmlElement(name = "MemberID")
    protected long memberID;
    @XmlElement(name = "MilestoneDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar milestoneDate;
    @XmlElement(name = "Priority")
    protected WorkItemPriorityObject priority;
    @XmlElement(name = "ProcessID")
    protected long processID;
    @XmlElement(name = "ProcessStatus")
    protected ProcessStatusObject processStatus;
    @XmlElement(name = "ProcessTitle")
    protected StringObject processTitle;
    @XmlElement(name = "ReadyDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar readyDate;
    @XmlElement(name = "Status", required = true)
    @XmlSchemaType(name = "string")
    protected WorkItemStatus status;
    @XmlElement(name = "SubProcessID")
    protected long subProcessID;
    @XmlElement(name = "Title")
    protected String title;

    /**
     * Gets the value of the dueDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDueDate() {
        return dueDate;
    }

    /**
     * Sets the value of the dueDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDueDate(XMLGregorianCalendar value) {
        this.dueDate = value;
    }

    /**
     * Gets the value of the groupActivity property.
     * 
     */
    public boolean isGroupActivity() {
        return groupActivity;
    }

    /**
     * Sets the value of the groupActivity property.
     * 
     */
    public void setGroupActivity(boolean value) {
        this.groupActivity = value;
    }

    /**
     * Gets the value of the id property.
     * 
     */
    public int getID() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     */
    public void setID(int value) {
        this.id = value;
    }

    /**
     * Gets the value of the initiatorID property.
     * 
     * @return
     *     possible object is
     *     {@link IntegerObject }
     *     
     */
    public IntegerObject getInitiatorID() {
        return initiatorID;
    }

    /**
     * Sets the value of the initiatorID property.
     * 
     * @param value
     *     allowed object is
     *     {@link IntegerObject }
     *     
     */
    public void setInitiatorID(IntegerObject value) {
        this.initiatorID = value;
    }

    /**
     * Gets the value of the memberID property.
     * 
     */
    public long getMemberID() {
        return memberID;
    }

    /**
     * Sets the value of the memberID property.
     * 
     */
    public void setMemberID(long value) {
        this.memberID = value;
    }

    /**
     * Gets the value of the milestoneDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getMilestoneDate() {
        return milestoneDate;
    }

    /**
     * Sets the value of the milestoneDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setMilestoneDate(XMLGregorianCalendar value) {
        this.milestoneDate = value;
    }

    /**
     * Gets the value of the priority property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemPriorityObject }
     *     
     */
    public WorkItemPriorityObject getPriority() {
        return priority;
    }

    /**
     * Sets the value of the priority property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemPriorityObject }
     *     
     */
    public void setPriority(WorkItemPriorityObject value) {
        this.priority = value;
    }

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
     * Gets the value of the processStatus property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessStatusObject }
     *     
     */
    public ProcessStatusObject getProcessStatus() {
        return processStatus;
    }

    /**
     * Sets the value of the processStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessStatusObject }
     *     
     */
    public void setProcessStatus(ProcessStatusObject value) {
        this.processStatus = value;
    }

    /**
     * Gets the value of the processTitle property.
     * 
     * @return
     *     possible object is
     *     {@link StringObject }
     *     
     */
    public StringObject getProcessTitle() {
        return processTitle;
    }

    /**
     * Sets the value of the processTitle property.
     * 
     * @param value
     *     allowed object is
     *     {@link StringObject }
     *     
     */
    public void setProcessTitle(StringObject value) {
        this.processTitle = value;
    }

    /**
     * Gets the value of the readyDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getReadyDate() {
        return readyDate;
    }

    /**
     * Sets the value of the readyDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setReadyDate(XMLGregorianCalendar value) {
        this.readyDate = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemStatus }
     *     
     */
    public WorkItemStatus getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemStatus }
     *     
     */
    public void setStatus(WorkItemStatus value) {
        this.status = value;
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

}
