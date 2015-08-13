
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="discussionInfo" type="{urn:Collaboration.service.livelink.opentext.com}DiscussionInfo" minOccurs="0"/&gt;
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
    "discussionInfo"
})
@XmlRootElement(name = "CreateDiscussion")
public class CreateDiscussion {

    protected DiscussionInfo discussionInfo;

    /**
     * Gets the value of the discussionInfo property.
     * 
     * @return
     *     possible object is
     *     {@link DiscussionInfo }
     *     
     */
    public DiscussionInfo getDiscussionInfo() {
        return discussionInfo;
    }

    /**
     * Sets the value of the discussionInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link DiscussionInfo }
     *     
     */
    public void setDiscussionInfo(DiscussionInfo value) {
        this.discussionInfo = value;
    }

}
