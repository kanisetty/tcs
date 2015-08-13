
package com.opentext.livelink.service.collaboration;

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
 *         &lt;element name="GetParticipantsResult" type="{urn:Collaboration.service.livelink.opentext.com}ProjectParticipants" minOccurs="0"/&gt;
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
    "getParticipantsResult"
})
@XmlRootElement(name = "GetParticipantsResponse")
public class GetParticipantsResponse {

    @XmlElement(name = "GetParticipantsResult")
    protected ProjectParticipants getParticipantsResult;

    /**
     * Gets the value of the getParticipantsResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectParticipants }
     *     
     */
    public ProjectParticipants getGetParticipantsResult() {
        return getParticipantsResult;
    }

    /**
     * Sets the value of the getParticipantsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectParticipants }
     *     
     */
    public void setGetParticipantsResult(ProjectParticipants value) {
        this.getParticipantsResult = value;
    }

}
