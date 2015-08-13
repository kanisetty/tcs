
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
 *         &lt;element name="CreateShortcutResult" type="{urn:DocMan.service.livelink.opentext.com}Node" minOccurs="0"/&gt;
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
    "createShortcutResult"
})
@XmlRootElement(name = "CreateShortcutResponse")
public class CreateShortcutResponse {

    @XmlElement(name = "CreateShortcutResult")
    protected Node createShortcutResult;

    /**
     * Gets the value of the createShortcutResult property.
     * 
     * @return
     *     possible object is
     *     {@link Node }
     *     
     */
    public Node getCreateShortcutResult() {
        return createShortcutResult;
    }

    /**
     * Sets the value of the createShortcutResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Node }
     *     
     */
    public void setCreateShortcutResult(Node value) {
        this.createShortcutResult = value;
    }

}
