
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for Assignment complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Assignment"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CreatedBy" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="CreatedByName" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="DateAssigned" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DateDue" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="DateDueColor" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="KeySig" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Priority" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="PriorityColor" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="PriorityString" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="Status" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="StatusColor" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="StatusString" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="SubType" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Assignment", propOrder = {
    "createdBy",
    "createdByName",
    "dateAssigned",
    "dateDue",
    "dateDueColor",
    "keySig",
    "name",
    "priority",
    "priorityColor",
    "priorityString",
    "status",
    "statusColor",
    "statusString",
    "subType"
})
public class Assignment
    extends ServiceDataObject
{

    @XmlElement(name = "CreatedBy", required = true, type = Long.class, nillable = true)
    protected Long createdBy;
    @XmlElement(name = "CreatedByName", required = true, nillable = true)
    protected String createdByName;
    @XmlElement(name = "DateAssigned", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dateAssigned;
    @XmlElement(name = "DateDue", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dateDue;
    @XmlElement(name = "DateDueColor", required = true, nillable = true)
    protected String dateDueColor;
    @XmlElement(name = "KeySig")
    protected String keySig;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "Priority", required = true, type = Integer.class, nillable = true)
    protected Integer priority;
    @XmlElement(name = "PriorityColor", required = true, nillable = true)
    protected String priorityColor;
    @XmlElement(name = "PriorityString", required = true, nillable = true)
    protected String priorityString;
    @XmlElement(name = "Status", required = true, type = Integer.class, nillable = true)
    protected Integer status;
    @XmlElement(name = "StatusColor", required = true, nillable = true)
    protected String statusColor;
    @XmlElement(name = "StatusString", required = true, nillable = true)
    protected String statusString;
    @XmlElement(name = "SubType")
    protected int subType;

    /**
     * Gets the value of the createdBy property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getCreatedBy() {
        return createdBy;
    }

    /**
     * Sets the value of the createdBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setCreatedBy(Long value) {
        this.createdBy = value;
    }

    /**
     * Gets the value of the createdByName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCreatedByName() {
        return createdByName;
    }

    /**
     * Sets the value of the createdByName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCreatedByName(String value) {
        this.createdByName = value;
    }

    /**
     * Gets the value of the dateAssigned property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDateAssigned() {
        return dateAssigned;
    }

    /**
     * Sets the value of the dateAssigned property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDateAssigned(XMLGregorianCalendar value) {
        this.dateAssigned = value;
    }

    /**
     * Gets the value of the dateDue property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDateDue() {
        return dateDue;
    }

    /**
     * Sets the value of the dateDue property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDateDue(XMLGregorianCalendar value) {
        this.dateDue = value;
    }

    /**
     * Gets the value of the dateDueColor property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDateDueColor() {
        return dateDueColor;
    }

    /**
     * Sets the value of the dateDueColor property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDateDueColor(String value) {
        this.dateDueColor = value;
    }

    /**
     * Gets the value of the keySig property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKeySig() {
        return keySig;
    }

    /**
     * Sets the value of the keySig property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKeySig(String value) {
        this.keySig = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the priority property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getPriority() {
        return priority;
    }

    /**
     * Sets the value of the priority property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setPriority(Integer value) {
        this.priority = value;
    }

    /**
     * Gets the value of the priorityColor property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPriorityColor() {
        return priorityColor;
    }

    /**
     * Sets the value of the priorityColor property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPriorityColor(String value) {
        this.priorityColor = value;
    }

    /**
     * Gets the value of the priorityString property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPriorityString() {
        return priorityString;
    }

    /**
     * Sets the value of the priorityString property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPriorityString(String value) {
        this.priorityString = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setStatus(Integer value) {
        this.status = value;
    }

    /**
     * Gets the value of the statusColor property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatusColor() {
        return statusColor;
    }

    /**
     * Sets the value of the statusColor property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatusColor(String value) {
        this.statusColor = value;
    }

    /**
     * Gets the value of the statusString property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatusString() {
        return statusString;
    }

    /**
     * Sets the value of the statusString property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatusString(String value) {
        this.statusString = value;
    }

    /**
     * Gets the value of the subType property.
     * 
     */
    public int getSubType() {
        return subType;
    }

    /**
     * Sets the value of the subType property.
     * 
     */
    public void setSubType(int value) {
        this.subType = value;
    }

}
