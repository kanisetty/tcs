
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.core.PageHandle;


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
 *         &lt;element name="ListProcessesResult" type="{urn:Core.service.livelink.opentext.com}PageHandle" minOccurs="0"/&gt;
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
    "listProcessesResult"
})
@XmlRootElement(name = "ListProcessesResponse")
public class ListProcessesResponse {

    @XmlElement(name = "ListProcessesResult")
    protected PageHandle listProcessesResult;

    /**
     * Gets the value of the listProcessesResult property.
     * 
     * @return
     *     possible object is
     *     {@link PageHandle }
     *     
     */
    public PageHandle getListProcessesResult() {
        return listProcessesResult;
    }

    /**
     * Sets the value of the listProcessesResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link PageHandle }
     *     
     */
    public void setListProcessesResult(PageHandle value) {
        this.listProcessesResult = value;
    }

}
