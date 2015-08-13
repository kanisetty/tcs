
package com.opentext.livelink.service.memberservice;

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
 *         &lt;element name="CreateDomainResult" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
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
    "createDomainResult"
})
@XmlRootElement(name = "CreateDomainResponse")
public class CreateDomainResponse {

    @XmlElement(name = "CreateDomainResult")
    protected long createDomainResult;

    /**
     * Gets the value of the createDomainResult property.
     * 
     */
    public long getCreateDomainResult() {
        return createDomainResult;
    }

    /**
     * Sets the value of the createDomainResult property.
     * 
     */
    public void setCreateDomainResult(long value) {
        this.createDomainResult = value;
    }

}
