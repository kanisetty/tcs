
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
 *         &lt;element name="channelInfo" type="{urn:Collaboration.service.livelink.opentext.com}ChannelInfo" minOccurs="0"/&gt;
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
    "channelInfo"
})
@XmlRootElement(name = "CreateChannel")
public class CreateChannel {

    protected ChannelInfo channelInfo;

    /**
     * Gets the value of the channelInfo property.
     * 
     * @return
     *     possible object is
     *     {@link ChannelInfo }
     *     
     */
    public ChannelInfo getChannelInfo() {
        return channelInfo;
    }

    /**
     * Sets the value of the channelInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link ChannelInfo }
     *     
     */
    public void setChannelInfo(ChannelInfo value) {
        this.channelInfo = value;
    }

}
