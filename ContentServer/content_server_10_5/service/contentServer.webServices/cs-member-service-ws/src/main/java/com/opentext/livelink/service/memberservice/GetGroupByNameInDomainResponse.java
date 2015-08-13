
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
 *         &lt;element name="GetGroupByNameInDomainResult" type="{urn:MemberService.service.livelink.opentext.com}Group" minOccurs="0"/&gt;
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
    "getGroupByNameInDomainResult"
})
@XmlRootElement(name = "GetGroupByNameInDomainResponse")
public class GetGroupByNameInDomainResponse {

    @XmlElement(name = "GetGroupByNameInDomainResult")
    protected Group getGroupByNameInDomainResult;

    /**
     * Gets the value of the getGroupByNameInDomainResult property.
     * 
     * @return
     *     possible object is
     *     {@link Group }
     *     
     */
    public Group getGetGroupByNameInDomainResult() {
        return getGroupByNameInDomainResult;
    }

    /**
     * Sets the value of the getGroupByNameInDomainResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Group }
     *     
     */
    public void setGetGroupByNameInDomainResult(Group value) {
        this.getGroupByNameInDomainResult = value;
    }

}
