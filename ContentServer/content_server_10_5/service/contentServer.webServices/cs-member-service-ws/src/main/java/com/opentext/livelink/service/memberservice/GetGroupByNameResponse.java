
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
 *         &lt;element name="GetGroupByNameResult" type="{urn:MemberService.service.livelink.opentext.com}Group" minOccurs="0"/&gt;
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
    "getGroupByNameResult"
})
@XmlRootElement(name = "GetGroupByNameResponse")
public class GetGroupByNameResponse {

    @XmlElement(name = "GetGroupByNameResult")
    protected Group getGroupByNameResult;

    /**
     * Gets the value of the getGroupByNameResult property.
     * 
     * @return
     *     possible object is
     *     {@link Group }
     *     
     */
    public Group getGetGroupByNameResult() {
        return getGroupByNameResult;
    }

    /**
     * Sets the value of the getGroupByNameResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Group }
     *     
     */
    public void setGetGroupByNameResult(Group value) {
        this.getGroupByNameResult = value;
    }

}
