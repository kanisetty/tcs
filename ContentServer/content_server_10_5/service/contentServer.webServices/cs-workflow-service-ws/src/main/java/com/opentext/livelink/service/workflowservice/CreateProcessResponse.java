
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
 *         &lt;element name="CreateProcessResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessInstance" minOccurs="0"/&gt;
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
    "createProcessResult"
})
@XmlRootElement(name = "CreateProcessResponse")
public class CreateProcessResponse {

    @XmlElement(name = "CreateProcessResult")
    protected ProcessInstance createProcessResult;

    /**
     * Gets the value of the createProcessResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessInstance }
     *     
     */
    public ProcessInstance getCreateProcessResult() {
        return createProcessResult;
    }

    /**
     * Sets the value of the createProcessResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessInstance }
     *     
     */
    public void setCreateProcessResult(ProcessInstance value) {
        this.createProcessResult = value;
    }

}
