
package com.opentext.livelink.service.collaboration;

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
 *         &lt;element name="milestoneInfo" type="{urn:Collaboration.service.livelink.opentext.com}MilestoneInfo" minOccurs="0"/&gt;
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
    "milestoneInfo"
})
@XmlRootElement(name = "CreateMilestone")
public class CreateMilestone {

    protected MilestoneInfo milestoneInfo;

    /**
     * Gets the value of the milestoneInfo property.
     * 
     * @return
     *     possible object is
     *     {@link MilestoneInfo }
     *     
     */
    public MilestoneInfo getMilestoneInfo() {
        return milestoneInfo;
    }

    /**
     * Sets the value of the milestoneInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link MilestoneInfo }
     *     
     */
    public void setMilestoneInfo(MilestoneInfo value) {
        this.milestoneInfo = value;
    }

}
