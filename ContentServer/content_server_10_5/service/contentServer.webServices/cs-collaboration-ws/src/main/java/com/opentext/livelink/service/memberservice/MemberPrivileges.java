
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for MemberPrivileges complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MemberPrivileges"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:MemberService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CanAdministerSystem" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CanAdministerUsers" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CreateUpdateGroups" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CreateUpdateUsers" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="LoginEnabled" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="PublicAccessEnabled" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MemberPrivileges", propOrder = {
    "canAdministerSystem",
    "canAdministerUsers",
    "createUpdateGroups",
    "createUpdateUsers",
    "loginEnabled",
    "publicAccessEnabled"
})
public class MemberPrivileges
    extends ServiceDataObject
{

    @XmlElement(name = "CanAdministerSystem")
    protected boolean canAdministerSystem;
    @XmlElement(name = "CanAdministerUsers")
    protected boolean canAdministerUsers;
    @XmlElement(name = "CreateUpdateGroups")
    protected boolean createUpdateGroups;
    @XmlElement(name = "CreateUpdateUsers")
    protected boolean createUpdateUsers;
    @XmlElement(name = "LoginEnabled")
    protected boolean loginEnabled;
    @XmlElement(name = "PublicAccessEnabled")
    protected boolean publicAccessEnabled;

    /**
     * Gets the value of the canAdministerSystem property.
     * 
     */
    public boolean isCanAdministerSystem() {
        return canAdministerSystem;
    }

    /**
     * Sets the value of the canAdministerSystem property.
     * 
     */
    public void setCanAdministerSystem(boolean value) {
        this.canAdministerSystem = value;
    }

    /**
     * Gets the value of the canAdministerUsers property.
     * 
     */
    public boolean isCanAdministerUsers() {
        return canAdministerUsers;
    }

    /**
     * Sets the value of the canAdministerUsers property.
     * 
     */
    public void setCanAdministerUsers(boolean value) {
        this.canAdministerUsers = value;
    }

    /**
     * Gets the value of the createUpdateGroups property.
     * 
     */
    public boolean isCreateUpdateGroups() {
        return createUpdateGroups;
    }

    /**
     * Sets the value of the createUpdateGroups property.
     * 
     */
    public void setCreateUpdateGroups(boolean value) {
        this.createUpdateGroups = value;
    }

    /**
     * Gets the value of the createUpdateUsers property.
     * 
     */
    public boolean isCreateUpdateUsers() {
        return createUpdateUsers;
    }

    /**
     * Sets the value of the createUpdateUsers property.
     * 
     */
    public void setCreateUpdateUsers(boolean value) {
        this.createUpdateUsers = value;
    }

    /**
     * Gets the value of the loginEnabled property.
     * 
     */
    public boolean isLoginEnabled() {
        return loginEnabled;
    }

    /**
     * Sets the value of the loginEnabled property.
     * 
     */
    public void setLoginEnabled(boolean value) {
        this.loginEnabled = value;
    }

    /**
     * Gets the value of the publicAccessEnabled property.
     * 
     */
    public boolean isPublicAccessEnabled() {
        return publicAccessEnabled;
    }

    /**
     * Sets the value of the publicAccessEnabled property.
     * 
     */
    public void setPublicAccessEnabled(boolean value) {
        this.publicAccessEnabled = value;
    }

}
