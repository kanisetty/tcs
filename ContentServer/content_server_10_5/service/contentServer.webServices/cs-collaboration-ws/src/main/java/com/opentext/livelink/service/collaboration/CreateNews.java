
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
 *         &lt;element name="newsInfo" type="{urn:Collaboration.service.livelink.opentext.com}NewsInfo" minOccurs="0"/&gt;
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
    "newsInfo",
    "livelinkAttachment",
    "attach"
})
@XmlRootElement(name = "CreateNews")
public class CreateNews {

    protected NewsInfo newsInfo;
    @XmlElement(required = true, type = Long.class, nillable = true)
    protected Long livelinkAttachment;
    protected Attachment attach;

    /**
     * Gets the value of the newsInfo property.
     * 
     * @return
     *     possible object is
     *     {@link NewsInfo }
     *     
     */
    public NewsInfo getNewsInfo() {
        return newsInfo;
    }

    /**
     * Sets the value of the newsInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link NewsInfo }
     *     
     */
    public void setNewsInfo(NewsInfo value) {
        this.newsInfo = value;
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
