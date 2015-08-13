
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
 *         &lt;element name="GetProcessStartDataResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessStartData" minOccurs="0"/&gt;
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
    "getProcessStartDataResult"
})
@XmlRootElement(name = "GetProcessStartDataResponse")
public class GetProcessStartDataResponse {

    @XmlElement(name = "GetProcessStartDataResult")
    protected ProcessStartData getProcessStartDataResult;

    /**
     * Gets the value of the getProcessStartDataResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessStartData }
     *     
     */
    public ProcessStartData getGetProcessStartDataResult() {
        return getProcessStartDataResult;
    }

    /**
     * Sets the value of the getProcessStartDataResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessStartData }
     *     
     */
    public void setGetProcessStartDataResult(ProcessStartData value) {
        this.getProcessStartDataResult = value;
    }

}
