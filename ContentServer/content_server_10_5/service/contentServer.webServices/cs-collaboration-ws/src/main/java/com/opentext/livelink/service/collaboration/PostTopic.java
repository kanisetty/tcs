
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.core.Attachment;


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
 *         &lt;element name="discussionID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="subject" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="comments" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="livelinkAttachment" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="attach" type="{urn:Core.service.livelink.opentext.com}Attachment" minOccurs="0"/&gt;
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
    "discussionID",
    "subject",
    "comments",
    "livelinkAttachment",
    "attach"
})
@XmlRootElement(name = "PostTopic")
public class PostTopic {

    protected long discussionID;
    protected String subject;
    protected String comments;
    @XmlElement(required = true, type = Long.class, nillable = true)
    protected Long livelinkAttachment;
    protected Attachment attach;

    /**
     * Gets the value of the discussionID property.
     * 
     */
    public long getDiscussionID() {
        return discussionID;
    }

    /**
     * Sets the value of the discussionID property.
     * 
     */
    public void setDiscussionID(long value) {
        this.discussionID = value;
    }

    /**
     * Gets the value of the subject property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubject() {
        return subject;
    }

    /**
     * Sets the value of the subject property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubject(String value) {
        this.subject = value;
    }

    /**
     * Gets the value of the comments property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComments() {
        return comments;
    }

    /**
     * Sets the value of the comments property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComments(String value) {
        this.comments = value;
    }

    /**
     * Gets the value of the livelinkAttachment property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getLivelinkAttachment() {
        return livelinkAttachment;
    }

    /**
     * Sets the value of the livelinkAttachment property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setLivelinkAttachment(Long value) {
        this.livelinkAttachment = value;
    }

    /**
     * Gets the value of the attach property.
     * 
     * @return
     *     possible object is
     *     {@link Attachment }
     *     
     */
    public Attachment getAttach() {
        return attach;
    }

    /**
     * Sets the value of the attach property.
     * 
     * @param value
     *     allowed object is
     *     {@link Attachment }
     *     
     */
    public void setAttach(Attachment value) {
        this.attach = value;
    }

}
