
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
 *         &lt;element name="CreateExternalGroupResult" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
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
    "createExternalGroupResult"
})
@XmlRootElement(name = "CreateExternalGroupResponse")
public class CreateExternalGroupResponse {

    @XmlElement(name = "CreateExternalGroupResult")
    protected long createExternalGroupResult;

    /**
     * Gets the value of the createExternalGroupResult property.
     * 
     */
    public long getCreateExternalGroupResult() {
        return createExternalGroupResult;
    }

    /**
     * Sets the value of the createExternalGroupResult property.
     * 
     */
    public void setCreateExternalGroupResult(long value) {
        this.createExternalGroupResult = value;
    }

}
