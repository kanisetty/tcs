
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProjectRoleUpdateInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProjectRoleUpdateInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Role" type="{urn:Collaboration.service.livelink.opentext.com}ProjectRole"/&gt;
 *         &lt;element name="RoleAction" type="{urn:Collaboration.service.livelink.opentext.com}ProjectRoleAction"/&gt;
 *         &lt;element name="UserID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProjectRoleUpdateInfo", propOrder = {
    "role",
    "roleAction",
    "userID"
})
public class ProjectRoleUpdateInfo
    extends ServiceDataObject
{

    @XmlElement(name = "Role", required = true)
    @XmlSchemaType(name = "string")
    protected ProjectRole role;
    @XmlElement(name = "RoleAction", required = true)
    @XmlSchemaType(name = "string")
    protected ProjectRoleAction roleAction;
    @XmlElement(name = "UserID")
    protected long userID;

    /**
     * Gets the value of the role property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectRole }
     *     
     */
    public ProjectRole getRole() {
        return role;
    }

    /**
     * Sets the value of the role property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectRole }
     *     
     */
    public void setRole(ProjectRole value) {
        this.role = value;
    }

    /**
     * Gets the value of the roleAction property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectRoleAction }
     *     
     */
    public ProjectRoleAction getRoleAction() {
        return roleAction;
    }

    /**
     * Sets the value of the roleAction property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectRoleAction }
     *     
     */
    public void setRoleAction(ProjectRoleAction value) {
        this.roleAction = value;
    }

    /**
     * Gets the value of the userID property.
     * 
     */
    public long getUserID() {
        return userID;
    }

    /**
     * Sets the value of the userID property.
     * 
     */
    public void setUserID(long value) {
        this.userID = value;
    }

}
