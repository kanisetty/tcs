
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
 *         &lt;element name="newsInfo" type="{urn:Collaboration.service.livelink.opentext.com}NewsInfo" minOccurs="0"/&gt;
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
    "newsInfo"
})
@XmlRootElement(name = "UpdateNews")
public class UpdateNews {

    protected NewsInfo newsInfo;

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

}
