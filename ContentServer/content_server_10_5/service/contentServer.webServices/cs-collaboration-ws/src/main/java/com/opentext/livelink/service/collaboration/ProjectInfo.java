
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for ProjectInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProjectInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CreatedBy" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Goals" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="ID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Initiatives" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="Mission" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Objectives" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="ParentID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="PublicAccess" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="StartDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Status" type="{urn:Collaboration.service.livelink.opentext.com}ProjectStatus"/&gt;
 *         &lt;element name="TargetDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProjectInfo", propOrder = {
    "createdBy",
    "goals",
    "id",
    "initiatives",
    "mission",
    "name",
    "objectives",
    "parentID",
    "publicAccess",
    "startDate",
    "status",
    "targetDate"
})
public class ProjectInfo
    extends ServiceDataObject
{

    @XmlElement(name = "CreatedBy", required = true, type = Long.class, nillable = true)
    protected Long createdBy;
    @XmlElement(name = "Goals", required = true, nillable = true)
    protected String goals;
    @XmlElement(name = "ID")
    protected long id;
    @XmlElement(name = "Initiatives", required = true, nillable = true)
    protected String initiatives;
    @XmlElement(name = "Mission", required = true, nillable = true)
    protected String mission;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "Objectives", required = true, nillable = true)
    protected String objectives;
    @XmlElement(name = "ParentID")
    protected long parentID;
    @XmlElement(name = "PublicAccess")
    protected boolean publicAccess;
    @XmlElement(name = "StartDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar startDate;
    @XmlElement(name = "Status", required = true)
    @XmlSchemaType(name = "string")
    protected ProjectStatus status;
    @XmlElement(name = "TargetDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar targetDate;

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
     * Gets the value of the goals property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGoals() {
        return goals;
    }

    /**
     * Sets the value of the goals property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGoals(String value) {
        this.goals = value;
    }

    /**
     * Gets the value of the id property.
     * 
     */
    public long getID() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     */
    public void setID(long value) {
        this.id = value;
    }

    /**
     * Gets the value of the initiatives property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getInitiatives() {
        return initiatives;
    }

    /**
     * Sets the value of the initiatives property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setInitiatives(String value) {
        this.initiatives = value;
    }

    /**
     * Gets the value of the mission property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMission() {
        return mission;
    }

    /**
     * Sets the value of the mission property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMission(String value) {
        this.mission = value;
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
     * Gets the value of the objectives property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getObjectives() {
        return objectives;
    }

    /**
     * Sets the value of the objectives property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setObjectives(String value) {
        this.objectives = value;
    }

    /**
     * Gets the value of the parentID property.
     * 
     */
    public long getParentID() {
        return parentID;
    }

    /**
     * Sets the value of the parentID property.
     * 
     */
    public void setParentID(long value) {
        this.parentID = value;
    }

    /**
     * Gets the value of the publicAccess property.
     * 
     */
    public boolean isPublicAccess() {
        return publicAccess;
    }

    /**
     * Sets the value of the publicAccess property.
     * 
     */
    public void setPublicAccess(boolean value) {
        this.publicAccess = value;
    }

    /**
     * Gets the value of the startDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getStartDate() {
        return startDate;
    }

    /**
     * Sets the value of the startDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setStartDate(XMLGregorianCalendar value) {
        this.startDate = value;
    }

    /**
     * Gets the value of the status property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectStatus }
     *     
     */
    public ProjectStatus getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectStatus }
     *     
     */
    public void setStatus(ProjectStatus value) {
        this.status = value;
    }

    /**
     * Gets the value of the targetDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getTargetDate() {
        return targetDate;
    }

    /**
     * Sets the value of the targetDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setTargetDate(XMLGregorianCalendar value) {
        this.targetDate = value;
    }

}
