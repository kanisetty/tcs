
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
 *         &lt;element name="GetUserByLoginNameInDomainResult" type="{urn:MemberService.service.livelink.opentext.com}User" minOccurs="0"/&gt;
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
    "getUserByLoginNameInDomainResult"
})
@XmlRootElement(name = "GetUserByLoginNameInDomainResponse")
public class GetUserByLoginNameInDomainResponse {

    @XmlElement(name = "GetUserByLoginNameInDomainResult")
    protected User getUserByLoginNameInDomainResult;

    /**
     * Gets the value of the getUserByLoginNameInDomainResult property.
     * 
     * @return
     *     possible object is
     *     {@link User }
     *     
     */
    public User getGetUserByLoginNameInDomainResult() {
        return getUserByLoginNameInDomainResult;
    }

    /**
     * Sets the value of the getUserByLoginNameInDomainResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link User }
     *     
     */
    public void setGetUserByLoginNameInDomainResult(User value) {
        this.getUserByLoginNameInDomainResult = value;
    }

}
