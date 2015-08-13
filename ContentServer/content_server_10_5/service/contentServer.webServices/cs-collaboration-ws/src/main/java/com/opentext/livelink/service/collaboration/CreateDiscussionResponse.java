
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.docman.Node;


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
 *         &lt;element name="CreateDiscussionResult" type="{urn:DocMan.service.livelink.opentext.com}Node" minOccurs="0"/&gt;
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
    "createDiscussionResult"
})
@XmlRootElement(name = "CreateDiscussionResponse")
public class CreateDiscussionResponse {

    @XmlElement(name = "CreateDiscussionResult")
    protected Node createDiscussionResult;

    /**
     * Gets the value of the createDiscussionResult property.
     * 
     * @return
     *     possible object is
     *     {@link Node }
     *     
     */
    public Node getCreateDiscussionResult() {
        return createDiscussionResult;
    }

    /**
     * Sets the value of the createDiscussionResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Node }
     *     
     */
    public void setCreateDiscussionResult(Node value) {
        this.createDiscussionResult = value;
    }

}
