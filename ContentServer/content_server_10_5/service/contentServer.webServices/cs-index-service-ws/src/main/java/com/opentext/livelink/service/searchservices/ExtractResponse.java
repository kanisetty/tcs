
package com.opentext.livelink.service.searchservices;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ExtractResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ExtractResponse"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:SearchServices.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="ExtractionFailures" type="{urn:SearchServices.service.livelink.opentext.com}ExtractionFailure" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="NumExtracted" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ExtractResponse", propOrder = {
    "extractionFailures",
    "numExtracted"
})
public class ExtractResponse
    extends ServiceDataObject
{

    @XmlElement(name = "ExtractionFailures")
    protected List<ExtractionFailure> extractionFailures;
    @XmlElement(name = "NumExtracted")
    protected int numExtracted;

    /**
     * Gets the value of the extractionFailures property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the extractionFailures property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getExtractionFailures().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ExtractionFailure }
     * 
     * 
     */
    public List<ExtractionFailure> getExtractionFailures() {
        if (extractionFailures == null) {
            extractionFailures = new ArrayList<ExtractionFailure>();
        }
        return this.extractionFailures;
    }

    /**
     * Gets the value of the numExtracted property.
     * 
     */
    public int getNumExtracted() {
        return numExtracted;
    }

    /**
     * Sets the value of the numExtracted property.
     * 
     */
    public void setNumExtracted(int value) {
        this.numExtracted = value;
    }

}
