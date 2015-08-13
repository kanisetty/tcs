
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ImportOptions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ImportOptions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Core.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CallbackHandlerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Creator" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CreatorID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="DontAddAcls" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="ExtUserInfo" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GroupOwner" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="GroupOwnerID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="HandlerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="InheritPermissions" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Owner" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="OwnerID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ImportOptions", propOrder = {
    "callbackHandlerName",
    "creator",
    "creatorID",
    "dontAddAcls",
    "extUserInfo",
    "groupOwner",
    "groupOwnerID",
    "handlerName",
    "inheritPermissions",
    "owner",
    "ownerID"
})
public class ImportOptions
    extends ServiceDataObject
{

    @XmlElement(name = "CallbackHandlerName")
    protected String callbackHandlerName;
    @XmlElement(name = "Creator")
    protected boolean creator;
    @XmlElement(name = "CreatorID")
    protected long creatorID;
    @XmlElement(name = "DontAddAcls")
    protected boolean dontAddAcls;
    @XmlElement(name = "ExtUserInfo")
    protected boolean extUserInfo;
    @XmlElement(name = "GroupOwner")
    protected boolean groupOwner;
    @XmlElement(name = "GroupOwnerID")
    protected long groupOwnerID;
    @XmlElement(name = "HandlerName")
    protected String handlerName;
    @XmlElement(name = "InheritPermissions")
    protected int inheritPermissions;
    @XmlElement(name = "Owner")
    protected boolean owner;
    @XmlElement(name = "OwnerID")
    protected long ownerID;

    /**
     * Gets the value of the callbackHandlerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCallbackHandlerName() {
        return callbackHandlerName;
    }

    /**
     * Sets the value of the callbackHandlerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCallbackHandlerName(String value) {
        this.callbackHandlerName = value;
    }

    /**
     * Gets the value of the creator property.
     * 
     */
    public boolean isCreator() {
        return creator;
    }

    /**
     * Sets the value of the creator property.
     * 
     */
    public void setCreator(boolean value) {
        this.creator = value;
    }

    /**
     * Gets the value of the creatorID property.
     * 
     */
    public long getCreatorID() {
        return creatorID;
    }

    /**
     * Sets the value of the creatorID property.
     * 
     */
    public void setCreatorID(long value) {
        this.creatorID = value;
    }

    /**
     * Gets the value of the dontAddAcls property.
     * 
     */
    public boolean isDontAddAcls() {
        return dontAddAcls;
    }

    /**
     * Sets the value of the dontAddAcls property.
     * 
     */
    public void setDontAddAcls(boolean value) {
        this.dontAddAcls = value;
    }

    /**
     * Gets the value of the extUserInfo property.
     * 
     */
    public boolean isExtUserInfo() {
        return extUserInfo;
    }

    /**
     * Sets the value of the extUserInfo property.
     * 
     */
    public void setExtUserInfo(boolean value) {
        this.extUserInfo = value;
    }

    /**
     * Gets the value of the groupOwner property.
     * 
     */
    public boolean isGroupOwner() {
        return groupOwner;
    }

    /**
     * Sets the value of the groupOwner property.
     * 
     */
    public void setGroupOwner(boolean value) {
        this.groupOwner = value;
    }

    /**
     * Gets the value of the groupOwnerID property.
     * 
     */
    public long getGroupOwnerID() {
        return groupOwnerID;
    }

    /**
     * Sets the value of the groupOwnerID property.
     * 
     */
    public void setGroupOwnerID(long value) {
        this.groupOwnerID = value;
    }

    /**
     * Gets the value of the handlerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHandlerName() {
        return handlerName;
    }

    /**
     * Sets the value of the handlerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHandlerName(String value) {
        this.handlerName = value;
    }

    /**
     * Gets the value of the inheritPermissions property.
     * 
     */
    public int getInheritPermissions() {
        return inheritPermissions;
    }

    /**
     * Sets the value of the inheritPermissions property.
     * 
     */
    public void setInheritPermissions(int value) {
        this.inheritPermissions = value;
    }

    /**
     * Gets the value of the owner property.
     * 
     */
    public boolean isOwner() {
        return owner;
    }

    /**
     * Sets the value of the owner property.
     * 
     */
    public void setOwner(boolean value) {
        this.owner = value;
    }

    /**
     * Gets the value of the ownerID property.
     * 
     */
    public long getOwnerID() {
        return ownerID;
    }

    /**
     * Sets the value of the ownerID property.
     * 
     */
    public void setOwnerID(long value) {
        this.ownerID = value;
    }

}
