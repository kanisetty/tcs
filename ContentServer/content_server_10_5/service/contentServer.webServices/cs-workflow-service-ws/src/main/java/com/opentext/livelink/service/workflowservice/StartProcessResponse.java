
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
 *         &lt;element name="StartProcessResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessInstance" minOccurs="0"/&gt;
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
    "startProcessResult"
})
@XmlRootElement(name = "StartProcessResponse")
public class StartProcessResponse {

    @XmlElement(name = "StartProcessResult")
    protected ProcessInstance startProcessResult;

    /**
     * Gets the value of the startProcessResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessInstance }
     *     
     */
    public ProcessInstance getStartProcessResult() {
        return startProcessResult;
    }

    /**
     * Sets the value of the startProcessResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessInstance }
     *     
     */
    public void setStartProcessResult(ProcessInstance value) {
        this.startProcessResult = value;
    }

}
