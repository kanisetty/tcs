
package com.opentext.livelink.service.searchservices;

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
 *         &lt;element name="ExtractObjectsResult" type="{urn:SearchServices.service.livelink.opentext.com}ExtractResponse" minOccurs="0"/&gt;
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
    "extractObjectsResult"
})
@XmlRootElement(name = "ExtractObjectsResponse")
public class ExtractObjectsResponse {

    @XmlElement(name = "ExtractObjectsResult")
    protected ExtractResponse extractObjectsResult;

    /**
     * Gets the value of the extractObjectsResult property.
     * 
     * @return
     *     possible object is
     *     {@link ExtractResponse }
     *     
     */
    public ExtractResponse getExtractObjectsResult() {
        return extractObjectsResult;
    }

    /**
     * Sets the value of the extractObjectsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ExtractResponse }
     *     
     */
    public void setExtractObjectsResult(ExtractResponse value) {
        this.extractObjectsResult = value;
    }

}
