
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
 *         &lt;element name="GetProcessDefinitionResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessDefinition" minOccurs="0"/&gt;
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
    "getProcessDefinitionResult"
})
@XmlRootElement(name = "GetProcessDefinitionResponse")
public class GetProcessDefinitionResponse {

    @XmlElement(name = "GetProcessDefinitionResult")
    protected ProcessDefinition getProcessDefinitionResult;

    /**
     * Gets the value of the getProcessDefinitionResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessDefinition }
     *     
     */
    public ProcessDefinition getGetProcessDefinitionResult() {
        return getProcessDefinitionResult;
    }

    /**
     * Sets the value of the getProcessDefinitionResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessDefinition }
     *     
     */
    public void setGetProcessDefinitionResult(ProcessDefinition value) {
        this.getProcessDefinitionResult = value;
    }

}
