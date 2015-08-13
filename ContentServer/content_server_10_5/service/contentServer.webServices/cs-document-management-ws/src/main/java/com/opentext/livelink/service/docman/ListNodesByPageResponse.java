
package com.opentext.livelink.service.docman;

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
 *         &lt;element name="ListNodesByPageResult" type="{urn:DocMan.service.livelink.opentext.com}NodePageResult" minOccurs="0"/&gt;
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
    "listNodesByPageResult"
})
@XmlRootElement(name = "ListNodesByPageResponse")
public class ListNodesByPageResponse {

    @XmlElement(name = "ListNodesByPageResult")
    protected NodePageResult listNodesByPageResult;

    /**
     * Gets the value of the listNodesByPageResult property.
     * 
     * @return
     *     possible object is
     *     {@link NodePageResult }
     *     
     */
    public NodePageResult getListNodesByPageResult() {
        return listNodesByPageResult;
    }

    /**
     * Sets the value of the listNodesByPageResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link NodePageResult }
     *     
     */
    public void setListNodesByPageResult(NodePageResult value) {
        this.listNodesByPageResult = value;
    }

}
