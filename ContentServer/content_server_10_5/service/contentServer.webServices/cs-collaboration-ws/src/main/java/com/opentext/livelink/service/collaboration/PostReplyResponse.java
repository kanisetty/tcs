
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
 *         &lt;element name="PostReplyResult" type="{urn:Collaboration.service.livelink.opentext.com}ReplyInfo" minOccurs="0"/&gt;
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
    "postReplyResult"
})
@XmlRootElement(name = "PostReplyResponse")
public class PostReplyResponse {

    @XmlElement(name = "PostReplyResult")
    protected ReplyInfo postReplyResult;

    /**
     * Gets the value of the postReplyResult property.
     * 
     * @return
     *     possible object is
     *     {@link ReplyInfo }
     *     
     */
    public ReplyInfo getPostReplyResult() {
        return postReplyResult;
    }

    /**
     * Sets the value of the postReplyResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ReplyInfo }
     *     
     */
    public void setPostReplyResult(ReplyInfo value) {
        this.postReplyResult = value;
    }

}
