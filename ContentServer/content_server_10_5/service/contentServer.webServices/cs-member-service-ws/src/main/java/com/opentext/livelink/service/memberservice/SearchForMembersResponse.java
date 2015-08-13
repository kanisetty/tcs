
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.core.PageHandle;


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
 *         &lt;element name="SearchForMembersResult" type="{urn:Core.service.livelink.opentext.com}PageHandle" minOccurs="0"/&gt;
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
    "searchForMembersResult"
})
@XmlRootElement(name = "SearchForMembersResponse")
public class SearchForMembersResponse {

    @XmlElement(name = "SearchForMembersResult")
    protected PageHandle searchForMembersResult;

    /**
     * Gets the value of the searchForMembersResult property.
     * 
     * @return
     *     possible object is
     *     {@link PageHandle }
     *     
     */
    public PageHandle getSearchForMembersResult() {
        return searchForMembersResult;
    }

    /**
     * Sets the value of the searchForMembersResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link PageHandle }
     *     
     */
    public void setSearchForMembersResult(PageHandle value) {
        this.searchForMembersResult = value;
    }

}
