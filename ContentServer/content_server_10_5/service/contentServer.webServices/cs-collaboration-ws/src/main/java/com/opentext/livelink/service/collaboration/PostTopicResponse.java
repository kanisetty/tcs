
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
 *         &lt;element name="PostTopicResult" type="{urn:Collaboration.service.livelink.opentext.com}TopicInfo" minOccurs="0"/&gt;
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
    "postTopicResult"
})
@XmlRootElement(name = "PostTopicResponse")
public class PostTopicResponse {

    @XmlElement(name = "PostTopicResult")
    protected TopicInfo postTopicResult;

    /**
     * Gets the value of the postTopicResult property.
     * 
     * @return
     *     possible object is
     *     {@link TopicInfo }
     *     
     */
    public TopicInfo getPostTopicResult() {
        return postTopicResult;
    }

    /**
     * Sets the value of the postTopicResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link TopicInfo }
     *     
     */
    public void setPostTopicResult(TopicInfo value) {
        this.postTopicResult = value;
    }

}
