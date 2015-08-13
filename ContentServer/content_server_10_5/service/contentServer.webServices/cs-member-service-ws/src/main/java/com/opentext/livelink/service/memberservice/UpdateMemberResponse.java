
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
 *         &lt;element name="UpdateMemberResult" type="{urn:MemberService.service.livelink.opentext.com}Member" minOccurs="0"/&gt;
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
    "updateMemberResult"
})
@XmlRootElement(name = "UpdateMemberResponse")
public class UpdateMemberResponse {

    @XmlElement(name = "UpdateMemberResult")
    protected Member updateMemberResult;

    /**
     * Gets the value of the updateMemberResult property.
     * 
     * @return
     *     possible object is
     *     {@link Member }
     *     
     */
    public Member getUpdateMemberResult() {
        return updateMemberResult;
    }

    /**
     * Sets the value of the updateMemberResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Member }
     *     
     */
    public void setUpdateMemberResult(Member value) {
        this.updateMemberResult = value;
    }

}
