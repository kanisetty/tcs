
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="parentID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="comment" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="attachmentData" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="resetMembers" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
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
    "parentID",
    "name",
    "comment",
    "attachmentData",
    "resetMembers",
    "attach"
})
@XmlRootElement(name = "ImportProcessDefinition")
public class ImportProcessDefinition {

    protected long parentID;
    protected String name;
    protected String comment;
    protected boolean attachmentData;
    protected boolean resetMembers;
    protected Attachment attach;

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
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the comment property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComment() {
        return comment;
    }

    /**
     * Sets the value of the comment property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComment(String value) {
        this.comment = value;
    }

    /**
     * Gets the value of the attachmentData property.
     * 
     */
    public boolean isAttachmentData() {
        return attachmentData;
    }

    /**
     * Sets the value of the attachmentData property.
     * 
     */
    public void setAttachmentData(boolean value) {
        this.attachmentData = value;
    }

    /**
     * Gets the value of the resetMembers property.
     * 
     */
    public boolean isResetMembers() {
        return resetMembers;
    }

    /**
     * Sets the value of the resetMembers property.
     * 
     */
    public void setResetMembers(boolean value) {
        this.resetMembers = value;
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
