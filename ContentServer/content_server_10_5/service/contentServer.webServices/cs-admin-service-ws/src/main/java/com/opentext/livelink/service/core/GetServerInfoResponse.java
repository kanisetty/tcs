
package com.opentext.livelink.service.core;

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
 *         &lt;element name="GetServerInfoResult" type="{urn:Core.service.livelink.opentext.com}ServerInfo" minOccurs="0"/&gt;
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
    "getServerInfoResult"
})
@XmlRootElement(name = "GetServerInfoResponse")
public class GetServerInfoResponse {

    @XmlElement(name = "GetServerInfoResult")
    protected ServerInfo getServerInfoResult;

    /**
     * Gets the value of the getServerInfoResult property.
     * 
     * @return
     *     possible object is
     *     {@link ServerInfo }
     *     
     */
    public ServerInfo getGetServerInfoResult() {
        return getServerInfoResult;
    }

    /**
     * Sets the value of the getServerInfoResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link ServerInfo }
     *     
     */
    public void setGetServerInfoResult(ServerInfo value) {
        this.getServerInfoResult = value;
    }

}
