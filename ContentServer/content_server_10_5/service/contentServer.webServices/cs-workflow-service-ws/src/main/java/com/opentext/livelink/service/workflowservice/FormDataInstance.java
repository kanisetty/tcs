
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.docman.AttributeGroupDefinition;


/**
 * <p>Java class for FormDataInstance complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="FormDataInstance"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Data" type="{urn:DocMan.service.livelink.opentext.com}AttributeGroupDefinition" minOccurs="0"/&gt;
 *         &lt;element name="DisplayAttachments" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="RequiredForm" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="SplitTran" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Stationery" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="StorageMechID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="SubmitMechID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="SubWorkID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="TaskID" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="TemplateID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Version" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="View" type="{http://www.w3.org/2001/XMLSchema}string"/&gt;
 *         &lt;element name="WorkID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "FormDataInstance", propOrder = {
    "data",
    "displayAttachments",
    "id",
    "name",
    "requiredForm",
    "splitTran",
    "stationery",
    "storageMechID",
    "submitMechID",
    "subWorkID",
    "taskID",
    "templateID",
    "version",
    "view",
    "workID"
})
public class FormDataInstance
    extends ServiceDataObject
{

    @XmlElement(name = "Data")
    protected AttributeGroupDefinition data;
    @XmlElement(name = "DisplayAttachments")
    protected boolean displayAttachments;
    @XmlElement(name = "ID")
    protected String id;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "RequiredForm")
    protected boolean requiredForm;
    @XmlElement(name = "SplitTran")
    protected boolean splitTran;
    @XmlElement(name = "Stationery")
    protected boolean stationery;
    @XmlElement(name = "StorageMechID")
    protected int storageMechID;
    @XmlElement(name = "SubmitMechID")
    protected int submitMechID;
    @XmlElement(name = "SubWorkID", required = true, type = Long.class, nillable = true)
    protected Long subWorkID;
    @XmlElement(name = "TaskID", required = true, type = Integer.class, nillable = true)
    protected Integer taskID;
    @XmlElement(name = "TemplateID")
    protected long templateID;
    @XmlElement(name = "Version")
    protected boolean version;
    @XmlElement(name = "View", required = true, nillable = true)
    protected String view;
    @XmlElement(name = "WorkID", required = true, type = Long.class, nillable = true)
    protected Long workID;

    /**
     * Gets the value of the data property.
     * 
     * @return
     *     possible object is
     *     {@link AttributeGroupDefinition }
     *     
     */
    public AttributeGroupDefinition getData() {
        return data;
    }

    /**
     * Sets the value of the data property.
     * 
     * @param value
     *     allowed object is
     *     {@link AttributeGroupDefinition }
     *     
     */
    public void setData(AttributeGroupDefinition value) {
        this.data = value;
    }

    /**
     * Gets the value of the displayAttachments property.
     * 
     */
    public boolean isDisplayAttachments() {
        return displayAttachments;
    }

    /**
     * Sets the value of the displayAttachments property.
     * 
     */
    public void setDisplayAttachments(boolean value) {
        this.displayAttachments = value;
    }

    /**
     * Gets the value of the id property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getID() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setID(String value) {
        this.id = value;
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
     * Gets the value of the requiredForm property.
     * 
     */
    public boolean isRequiredForm() {
        return requiredForm;
    }

    /**
     * Sets the value of the requiredForm property.
     * 
     */
    public void setRequiredForm(boolean value) {
        this.requiredForm = value;
    }

    /**
     * Gets the value of the splitTran property.
     * 
     */
    public boolean isSplitTran() {
        return splitTran;
    }

    /**
     * Sets the value of the splitTran property.
     * 
     */
    public void setSplitTran(boolean value) {
        this.splitTran = value;
    }

    /**
     * Gets the value of the stationery property.
     * 
     */
    public boolean isStationery() {
        return stationery;
    }

    /**
     * Sets the value of the stationery property.
     * 
     */
    public void setStationery(boolean value) {
        this.stationery = value;
    }

    /**
     * Gets the value of the storageMechID property.
     * 
     */
    public int getStorageMechID() {
        return storageMechID;
    }

    /**
     * Sets the value of the storageMechID property.
     * 
     */
    public void setStorageMechID(int value) {
        this.storageMechID = value;
    }

    /**
     * Gets the value of the submitMechID property.
     * 
     */
    public int getSubmitMechID() {
        return submitMechID;
    }

    /**
     * Sets the value of the submitMechID property.
     * 
     */
    public void setSubmitMechID(int value) {
        this.submitMechID = value;
    }

    /**
     * Gets the value of the subWorkID property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getSubWorkID() {
        return subWorkID;
    }

    /**
     * Sets the value of the subWorkID property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setSubWorkID(Long value) {
        this.subWorkID = value;
    }

    /**
     * Gets the value of the taskID property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getTaskID() {
        return taskID;
    }

    /**
     * Sets the value of the taskID property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setTaskID(Integer value) {
        this.taskID = value;
    }

    /**
     * Gets the value of the templateID property.
     * 
     */
    public long getTemplateID() {
        return templateID;
    }

    /**
     * Sets the value of the templateID property.
     * 
     */
    public void setTemplateID(long value) {
        this.templateID = value;
    }

    /**
     * Gets the value of the version property.
     * 
     */
    public boolean isVersion() {
        return version;
    }

    /**
     * Sets the value of the version property.
     * 
     */
    public void setVersion(boolean value) {
        this.version = value;
    }

    /**
     * Gets the value of the view property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getView() {
        return view;
    }

    /**
     * Sets the value of the view property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setView(String value) {
        this.view = value;
    }

    /**
     * Gets the value of the workID property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getWorkID() {
        return workID;
    }

    /**
     * Sets the value of the workID property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setWorkID(Long value) {
        this.workID = value;
    }

}
