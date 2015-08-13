
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
 *         &lt;element name="UpdateNodeRightsResult" type="{urn:DocMan.service.livelink.opentext.com}NodeRightUpdateInfo" minOccurs="0"/&gt;
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
    "updateNodeRightsResult"
})
@XmlRootElement(name = "UpdateNodeRightsResponse")
public class UpdateNodeRightsResponse {

    @XmlElement(name = "UpdateNodeRightsResult")
    protected NodeRightUpdateInfo updateNodeRightsResult;

    /**
     * Gets the value of the updateNodeRightsResult property.
     * 
     * @return
     *     possible object is
     *     {@link NodeRightUpdateInfo }
     *     
     */
    public NodeRightUpdateInfo getUpdateNodeRightsResult() {
        return updateNodeRightsResult;
    }

    /**
     * Sets the value of the updateNodeRightsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link NodeRightUpdateInfo }
     *     
     */
    public void setUpdateNodeRightsResult(NodeRightUpdateInfo value) {
        this.updateNodeRightsResult = value;
    }

}
