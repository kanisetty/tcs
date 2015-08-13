
package com.opentext.livelink.service.core;

import java.util.ArrayList;
import java.util.List;
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
 *         &lt;element name="GetDateFormatsResult" type="{urn:Core.service.livelink.opentext.com}DateFormat" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "getDateFormatsResult"
})
@XmlRootElement(name = "GetDateFormatsResponse")
public class GetDateFormatsResponse {

    @XmlElement(name = "GetDateFormatsResult", nillable = true)
    protected List<DateFormat> getDateFormatsResult;

    /**
     * Gets the value of the getDateFormatsResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the getDateFormatsResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getGetDateFormatsResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DateFormat }
     * 
     * 
     */
    public List<DateFormat> getGetDateFormatsResult() {
        if (getDateFormatsResult == null) {
            getDateFormatsResult = new ArrayList<DateFormat>();
        }
        return this.getDateFormatsResult;
    }

}
