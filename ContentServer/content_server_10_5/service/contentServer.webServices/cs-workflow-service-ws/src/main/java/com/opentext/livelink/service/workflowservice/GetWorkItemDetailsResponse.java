
package com.opentext.livelink.service.workflowservice;

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
 *         &lt;element name="GetWorkItemDetailsResult" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemDetails" minOccurs="0"/&gt;
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
    "getWorkItemDetailsResult"
})
@XmlRootElement(name = "GetWorkItemDetailsResponse")
public class GetWorkItemDetailsResponse {

    @XmlElement(name = "GetWorkItemDetailsResult")
    protected WorkItemDetails getWorkItemDetailsResult;

    /**
     * Gets the value of the getWorkItemDetailsResult property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemDetails }
     *     
     */
    public WorkItemDetails getGetWorkItemDetailsResult() {
        return getWorkItemDetailsResult;
    }

    /**
     * Sets the value of the getWorkItemDetailsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemDetails }
     *     
     */
    public void setGetWorkItemDetailsResult(WorkItemDetails value) {
        this.getWorkItemDetailsResult = value;
    }

}
