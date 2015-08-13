
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
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
 *         &lt;element name="GetAuthenticatedUserResult" type="{urn:MemberService.service.livelink.opentext.com}User" minOccurs="0"/&gt;
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
    "getAuthenticatedUserResult"
})
@XmlRootElement(name = "GetAuthenticatedUserResponse")
public class GetAuthenticatedUserResponse {

    @XmlElement(name = "GetAuthenticatedUserResult")
    protected User getAuthenticatedUserResult;

    /**
     * Gets the value of the getAuthenticatedUserResult property.
     * 
     * @return
     *     possible object is
     *     {@link User }
     *     
     */
    public User getGetAuthenticatedUserResult() {
        return getAuthenticatedUserResult;
    }

    /**
     * Sets the value of the getAuthenticatedUserResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link User }
     *     
     */
    public void setGetAuthenticatedUserResult(User value) {
        this.getAuthenticatedUserResult = value;
    }

}
