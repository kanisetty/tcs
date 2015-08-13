
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
 *         &lt;element name="ListWorkItemsResult" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItemResult" minOccurs="0"/&gt;
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
    "listWorkItemsResult"
})
@XmlRootElement(name = "ListWorkItemsResponse")
public class ListWorkItemsResponse {

    @XmlElement(name = "ListWorkItemsResult")
    protected WorkItemResult listWorkItemsResult;

    /**
     * Gets the value of the listWorkItemsResult property.
     * 
     * @return
     *     possible object is
     *     {@link WorkItemResult }
     *     
     */
    public WorkItemResult getListWorkItemsResult() {
        return listWorkItemsResult;
    }

    /**
     * Sets the value of the listWorkItemsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link WorkItemResult }
     *     
     */
    public void setListWorkItemsResult(WorkItemResult value) {
        this.listWorkItemsResult = value;
    }

}
