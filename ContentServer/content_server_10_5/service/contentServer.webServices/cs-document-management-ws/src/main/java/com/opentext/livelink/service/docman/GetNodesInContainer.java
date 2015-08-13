
package com.opentext.livelink.service.docman;

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
 *         &lt;element name="containerID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="options" type="{urn:DocMan.service.livelink.opentext.com}GetNodesInContainerOptions" minOccurs="0"/&gt;
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
    "containerID",
    "options"
})
@XmlRootElement(name = "GetNodesInContainer")
public class GetNodesInContainer {

    protected long containerID;
    protected GetNodesInContainerOptions options;

    /**
     * Gets the value of the containerID property.
     * 
     */
    public long getContainerID() {
        return containerID;
    }

    /**
     * Sets the value of the containerID property.
     * 
     */
    public void setContainerID(long value) {
        this.containerID = value;
    }

    /**
     * Gets the value of the options property.
     * 
     * @return
     *     possible object is
     *     {@link GetNodesInContainerOptions }
     *     
     */
    public GetNodesInContainerOptions getOptions() {
        return options;
    }

    /**
     * Sets the value of the options property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetNodesInContainerOptions }
     *     
     */
    public void setOptions(GetNodesInContainerOptions value) {
        this.options = value;
    }

}
