
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
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
 *         &lt;element name="ListProcessHistoryResult" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessEvent" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "listProcessHistoryResult"
})
@XmlRootElement(name = "ListProcessHistoryResponse")
public class ListProcessHistoryResponse {

    @XmlElement(name = "ListProcessHistoryResult", nillable = true)
    protected List<ProcessEvent> listProcessHistoryResult;

    /**
     * Gets the value of the listProcessHistoryResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listProcessHistoryResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListProcessHistoryResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ProcessEvent }
     * 
     * 
     */
    public List<ProcessEvent> getListProcessHistoryResult() {
        if (listProcessHistoryResult == null) {
            listProcessHistoryResult = new ArrayList<ProcessEvent>();
        }
        return this.listProcessHistoryResult;
    }

}
