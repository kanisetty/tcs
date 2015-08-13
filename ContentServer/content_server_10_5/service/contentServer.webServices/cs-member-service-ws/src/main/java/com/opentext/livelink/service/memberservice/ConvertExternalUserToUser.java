
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
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
 *         &lt;element name="userID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="groupID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="memberPrivileges" type="{urn:MemberService.service.livelink.opentext.com}MemberPrivileges" minOccurs="0"/&gt;
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
    "userID",
    "groupID",
    "memberPrivileges"
})
@XmlRootElement(name = "ConvertExternalUserToUser")
public class ConvertExternalUserToUser {

    protected long userID;
    protected long groupID;
    protected MemberPrivileges memberPrivileges;

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
     * Gets the value of the memberPrivileges property.
     * 
     * @return
     *     possible object is
     *     {@link MemberPrivileges }
     *     
     */
    public MemberPrivileges getMemberPrivileges() {
        return memberPrivileges;
    }

    /**
     * Sets the value of the memberPrivileges property.
     * 
     * @param value
     *     allowed object is
     *     {@link MemberPrivileges }
     *     
     */
    public void setMemberPrivileges(MemberPrivileges value) {
        this.memberPrivileges = value;
    }

}
