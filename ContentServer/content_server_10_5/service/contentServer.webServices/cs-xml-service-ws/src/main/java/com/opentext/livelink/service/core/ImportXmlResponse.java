
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
 *         &lt;element name="ImportXmlResult" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
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
    "importXmlResult"
})
@XmlRootElement(name = "ImportXmlResponse")
public class ImportXmlResponse {

    @XmlElement(name = "ImportXmlResult")
    protected long importXmlResult;

    /**
     * Gets the value of the importXmlResult property.
     * 
     */
    public long getImportXmlResult() {
        return importXmlResult;
    }

    /**
     * Sets the value of the importXmlResult property.
     * 
     */
    public void setImportXmlResult(long value) {
        this.importXmlResult = value;
    }

}
