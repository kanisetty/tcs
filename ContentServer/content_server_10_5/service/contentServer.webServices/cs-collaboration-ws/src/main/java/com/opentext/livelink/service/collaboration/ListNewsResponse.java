
package com.opentext.livelink.service.collaboration;

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
 *         &lt;element name="ListNewsResult" type="{urn:Collaboration.service.livelink.opentext.com}NewsInfo" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "listNewsResult"
})
@XmlRootElement(name = "ListNewsResponse")
public class ListNewsResponse {

    @XmlElement(name = "ListNewsResult", nillable = true)
    protected List<NewsInfo> listNewsResult;

    /**
     * Gets the value of the listNewsResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listNewsResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListNewsResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link NewsInfo }
     * 
     * 
     */
    public List<NewsInfo> getListNewsResult() {
        if (listNewsResult == null) {
            listNewsResult = new ArrayList<NewsInfo>();
        }
        return this.listNewsResult;
    }

}
