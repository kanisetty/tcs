
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for ProcessInstance complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessInstance"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Activities" type="{urn:WorkflowService.service.livelink.opentext.com}ActivityInstance" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="CompletedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DueDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="InitiatedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="InitiatorID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ManagerID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ProcessID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Status" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessStatus"/&gt;
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
@XmlType(name = "ProcessInstance", propOrder = {
    "activities",
    "completedDate",
    "dueDate",
    "initiatedDate",
    "initiatorID",
    "managerID",
    "processID",
    "status",
    "subProcessID",
    "title"
})
public class ProcessInstance
    extends ServiceDataObject
{

    @XmlElement(name = "Activities")
    protected List<ActivityInstance> activities;
    @XmlElement(name = "CompletedDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar completedDate;
    @XmlElement(name = "DueDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dueDate;
    @XmlElement(name = "InitiatedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar initiatedDate;
    @XmlElement(name = "InitiatorID")
    protected long initiatorID;
    @XmlElement(name = "ManagerID")
    protected long managerID;
    @XmlElement(name = "ProcessID")
    protected long processID;
    @XmlElement(name = "Status", required = true)
    @XmlSchemaType(name = "string")
    protected ProcessStatus status;
    @XmlElement(name = "SubProcessID")
    protected long subProcessID;
    @XmlElement(name = "Title")
    protected String title;

    /**
     * Gets the value of the activities property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the activities property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getActivities().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ActivityInstance }
     * 
     * 
     */
    public List<ActivityInstance> getActivities() {
        if (activities == null) {
            activities = new ArrayList<ActivityInstance>();
        }
        return this.activities;
    }

    /**
     * Gets the value of the completedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getCompletedDate() {
        return completedDate;
    }

    /**
     * Sets the value of the completedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setCompletedDate(XMLGregorianCalendar value) {
        this.completedDate = value;
    }

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
     * Gets the value of the initiatedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getInitiatedDate() {
        return initiatedDate;
    }

    /**
     * Sets the value of the initiatedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setInitiatedDate(XMLGregorianCalendar value) {
        this.initiatedDate = value;
    }

    /**
     * Gets the value of the initiatorID property.
     * 
     */
    public long getInitiatorID() {
        return initiatorID;
    }

    /**
     * Sets the value of the initiatorID property.
     * 
     */
    public void setInitiatorID(long value) {
        this.initiatorID = value;
    }

    /**
     * Gets the value of the managerID property.
     * 
     */
    public long getManagerID() {
        return managerID;
    }

    /**
     * Sets the value of the managerID property.
     * 
     */
    public void setManagerID(long value) {
        this.managerID = value;
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
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessStatus }
     *     
     */
    public ProcessStatus getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessStatus }
     *     
     */
    public void setStatus(ProcessStatus value) {
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
