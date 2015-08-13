
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
 *         &lt;element name="GetProcessDefinitionExResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessDefinition" minOccurs="0"/&gt;
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
    "getProcessDefinitionExResult"
})
@XmlRootElement(name = "GetProcessDefinitionExResponse")
public class GetProcessDefinitionExResponse {

    @XmlElement(name = "GetProcessDefinitionExResult")
    protected ProcessDefinition getProcessDefinitionExResult;

    /**
     * Gets the value of the getProcessDefinitionExResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessDefinition }
     *     
     */
    public ProcessDefinition getGetProcessDefinitionExResult() {
        return getProcessDefinitionExResult;
    }

    /**
     * Sets the value of the getProcessDefinitionExResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessDefinition }
     *     
     */
    public void setGetProcessDefinitionExResult(ProcessDefinition value) {
        this.getProcessDefinitionExResult = value;
    }

}
