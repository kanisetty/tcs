
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ChannelInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ChannelInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CreatedBy" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ParentID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ChannelInfo", propOrder = {
    "createdBy",
    "id",
    "name",
    "parentID"
})
public class ChannelInfo
    extends ServiceDataObject
{

    @XmlElement(name = "CreatedBy", required = true, type = Long.class, nillable = true)
    protected Long createdBy;
    @XmlElement(name = "ID")
    protected long id;
    @XmlElement(name = "Name")
    protected String name;
    @XmlElement(name = "ParentID")
    protected long parentID;

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

}
