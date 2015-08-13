
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
 *         &lt;element name="GetListProcessesResultsResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessResult" minOccurs="0"/&gt;
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
    "getListProcessesResultsResult"
})
@XmlRootElement(name = "GetListProcessesResultsResponse")
public class GetListProcessesResultsResponse {

    @XmlElement(name = "GetListProcessesResultsResult")
    protected ProcessResult getListProcessesResultsResult;

    /**
     * Gets the value of the getListProcessesResultsResult property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessResult }
     *     
     */
    public ProcessResult getGetListProcessesResultsResult() {
        return getListProcessesResultsResult;
    }

    /**
     * Sets the value of the getListProcessesResultsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessResult }
     *     
     */
    public void setGetListProcessesResultsResult(ProcessResult value) {
        this.getListProcessesResultsResult = value;
    }

}
