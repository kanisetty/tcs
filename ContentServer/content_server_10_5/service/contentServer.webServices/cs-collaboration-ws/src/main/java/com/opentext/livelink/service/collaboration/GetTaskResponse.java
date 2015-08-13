
package com.opentext.livelink.service.collaboration;

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
 *         &lt;element name="GetTaskResult" type="{urn:Collaboration.service.livelink.opentext.com}TaskInfo" minOccurs="0"/&gt;
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
    "getTaskResult"
})
@XmlRootElement(name = "GetTaskResponse")
public class GetTaskResponse {

    @XmlElement(name = "GetTaskResult")
    protected TaskInfo getTaskResult;

    /**
     * Gets the value of the getTaskResult property.
     * 
     * @return
     *     possible object is
     *     {@link TaskInfo }
     *     
     */
    public TaskInfo getGetTaskResult() {
        return getTaskResult;
    }

    /**
     * Sets the value of the getTaskResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link TaskInfo }
     *     
     */
    public void setGetTaskResult(TaskInfo value) {
        this.getTaskResult = value;
    }

}
