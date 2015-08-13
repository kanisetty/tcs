
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
 *         &lt;element name="GetProcessStatusResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessInstance" minOccurs="0"/&gt;
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
    "getProcessStatusResult"
})
@XmlRootElement(name = "GetProcessStatusResponse")
public class GetProcessStatusResponse {

    @XmlElement(name = "GetProcessStatusResult")
    protected ProcessInstance getProcessStatusResult;

    /**
     * Gets the value of the getProcessStatusResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessInstance }
     *     
     */
    public ProcessInstance getGetProcessStatusResult() {
        return getProcessStatusResult;
    }

    /**
     * Sets the value of the getProcessStatusResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessInstance }
     *     
     */
    public void setGetProcessStatusResult(ProcessInstance value) {
        this.getProcessStatusResult = value;
    }

}
