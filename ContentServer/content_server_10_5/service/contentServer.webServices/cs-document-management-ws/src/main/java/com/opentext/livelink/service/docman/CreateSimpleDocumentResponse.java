
package com.opentext.livelink.service.docman;

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
 *         &lt;element name="CreateSimpleDocumentResult" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
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
    "createSimpleDocumentResult"
})
@XmlRootElement(name = "CreateSimpleDocumentResponse")
public class CreateSimpleDocumentResponse {

    @XmlElement(name = "CreateSimpleDocumentResult")
    protected long createSimpleDocumentResult;

    /**
     * Gets the value of the createSimpleDocumentResult property.
     * 
     */
    public long getCreateSimpleDocumentResult() {
        return createSimpleDocumentResult;
    }

    /**
     * Sets the value of the createSimpleDocumentResult property.
     * 
     */
    public void setCreateSimpleDocumentResult(long value) {
        this.createSimpleDocumentResult = value;
    }

}
