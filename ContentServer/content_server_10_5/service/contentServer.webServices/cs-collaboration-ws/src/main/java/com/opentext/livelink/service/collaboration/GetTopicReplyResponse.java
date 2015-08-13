
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
 *         &lt;element name="GetTopicReplyResult" type="{urn:Collaboration.service.livelink.opentext.com}DiscussionItem" minOccurs="0"/&gt;
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
    "getTopicReplyResult"
})
@XmlRootElement(name = "GetTopicReplyResponse")
public class GetTopicReplyResponse {

    @XmlElement(name = "GetTopicReplyResult")
    protected DiscussionItem getTopicReplyResult;

    /**
     * Gets the value of the getTopicReplyResult property.
     * 
     * @return
     *     possible object is
     *     {@link DiscussionItem }
     *     
     */
    public DiscussionItem getGetTopicReplyResult() {
        return getTopicReplyResult;
    }

    /**
     * Sets the value of the getTopicReplyResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link DiscussionItem }
     *     
     */
    public void setGetTopicReplyResult(DiscussionItem value) {
        this.getTopicReplyResult = value;
    }

}
