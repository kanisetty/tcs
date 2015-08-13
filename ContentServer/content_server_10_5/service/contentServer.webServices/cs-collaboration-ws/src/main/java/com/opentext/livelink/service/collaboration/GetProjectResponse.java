
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
 *         &lt;element name="GetProjectResult" type="{urn:Collaboration.service.livelink.opentext.com}ProjectInfo" minOccurs="0"/&gt;
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
    "getProjectResult"
})
@XmlRootElement(name = "GetProjectResponse")
public class GetProjectResponse {

    @XmlElement(name = "GetProjectResult")
    protected ProjectInfo getProjectResult;

    /**
     * Gets the value of the getProjectResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectInfo }
     *     
     */
    public ProjectInfo getGetProjectResult() {
        return getProjectResult;
    }

    /**
     * Sets the value of the getProjectResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectInfo }
     *     
     */
    public void setGetProjectResult(ProjectInfo value) {
        this.getProjectResult = value;
    }

}
