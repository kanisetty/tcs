
package com.opentext.livelink.service.collaboration;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for DiscussionItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DiscussionItem"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Attachments" type="{urn:Collaboration.service.livelink.opentext.com}TopicAttachment" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="Content" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Ordering" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ParentID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="PostedBy" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="PostedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Subject" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DiscussionItem", propOrder = {
    "attachments",
    "content",
    "id",
    "ordering",
    "parentID",
    "postedBy",
    "postedDate",
    "subject"
})
@XmlSeeAlso({
    ReplyInfo.class,
    TopicInfo.class
})
public class DiscussionItem
    extends ServiceDataObject
{

    @XmlElement(name = "Attachments")
    protected List<TopicAttachment> attachments;
    @XmlElement(name = "Content")
    protected String content;
    @XmlElement(name = "ID")
    protected long id;
    @XmlElement(name = "Ordering")
    protected long ordering;
    @XmlElement(name = "ParentID")
    protected long parentID;
    @XmlElement(name = "PostedBy")
    protected long postedBy;
    @XmlElement(name = "PostedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar postedDate;
    @XmlElement(name = "Subject")
    protected String subject;

    /**
     * Gets the value of the attachments property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the attachments property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAttachments().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link TopicAttachment }
     * 
     * 
     */
    public List<TopicAttachment> getAttachments() {
        if (attachments == null) {
            attachments = new ArrayList<TopicAttachment>();
        }
        return this.attachments;
    }

    /**
     * Gets the value of the content property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets the value of the content property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContent(String value) {
        this.content = value;
    }

    /**
     * Gets the value of the id property.
     * 
     */
    public long getID() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     */
    public void setID(long value) {
        this.id = value;
    }

    /**
     * Gets the value of the ordering property.
     * 
     */
    public long getOrdering() {
        return ordering;
    }

    /**
     * Sets the value of the ordering property.
     * 
     */
    public void setOrdering(long value) {
        this.ordering = value;
    }

    /**
     * Gets the value of the parentID property.
     * 
     */
    public long getParentID() {
        return parentID;
    }

    /**
     * Sets the value of the parentID property.
     * 
     */
    public void setParentID(long value) {
        this.parentID = value;
    }

    /**
     * Gets the value of the postedBy property.
     * 
     */
    public long getPostedBy() {
        return postedBy;
    }

    /**
     * Sets the value of the postedBy property.
     * 
     */
    public void setPostedBy(long value) {
        this.postedBy = value;
    }

    /**
     * Gets the value of the postedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getPostedDate() {
        return postedDate;
    }

    /**
     * Sets the value of the postedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setPostedDate(XMLGregorianCalendar value) {
        this.postedDate = value;
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

}
