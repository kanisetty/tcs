
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
 *         &lt;element name="ImportProcessDefinitionResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessDefinition" minOccurs="0"/&gt;
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
    "importProcessDefinitionResult"
})
@XmlRootElement(name = "ImportProcessDefinitionResponse")
public class ImportProcessDefinitionResponse {

    @XmlElement(name = "ImportProcessDefinitionResult")
    protected ProcessDefinition importProcessDefinitionResult;

    /**
     * Gets the value of the importProcessDefinitionResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessDefinition }
     *     
     */
    public ProcessDefinition getImportProcessDefinitionResult() {
        return importProcessDefinitionResult;
    }

    /**
     * Sets the value of the importProcessDefinitionResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessDefinition }
     *     
     */
    public void setImportProcessDefinitionResult(ProcessDefinition value) {
        this.importProcessDefinitionResult = value;
    }

}
