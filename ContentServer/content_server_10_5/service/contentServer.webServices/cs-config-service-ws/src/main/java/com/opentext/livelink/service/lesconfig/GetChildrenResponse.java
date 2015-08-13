
package com.opentext.livelink.service.lesconfig;

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
 *         &lt;element name="GetChildrenResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getChildrenResult"
})
@XmlRootElement(name = "GetChildrenResponse")
public class GetChildrenResponse {

    @XmlElement(name = "GetChildrenResult")
    protected String getChildrenResult;

    /**
     * Gets the value of the getChildrenResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetChildrenResult() {
        return getChildrenResult;
    }

    /**
     * Sets the value of the getChildrenResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetChildrenResult(String value) {
        this.getChildrenResult = value;
    }

}
