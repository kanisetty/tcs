
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
 *         &lt;element name="GetNodeByGUIDResult" type="{urn:DocMan.service.livelink.opentext.com}Node" minOccurs="0"/&gt;
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
    "getNodeByGUIDResult"
})
@XmlRootElement(name = "GetNodeByGUIDResponse")
public class GetNodeByGUIDResponse {

    @XmlElement(name = "GetNodeByGUIDResult")
    protected Node getNodeByGUIDResult;

    /**
     * Gets the value of the getNodeByGUIDResult property.
     * 
     * @return
     *     possible object is
     *     {@link Node }
     *     
     */
    public Node getGetNodeByGUIDResult() {
        return getNodeByGUIDResult;
    }

    /**
     * Sets the value of the getNodeByGUIDResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Node }
     *     
     */
    public void setGetNodeByGUIDResult(Node value) {
        this.getNodeByGUIDResult = value;
    }

}
