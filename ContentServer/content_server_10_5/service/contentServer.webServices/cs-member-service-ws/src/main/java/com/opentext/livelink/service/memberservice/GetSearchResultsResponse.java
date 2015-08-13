
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
 *         &lt;element name="GetSearchResultsResult" type="{urn:MemberService.service.livelink.opentext.com}MemberSearchResults" minOccurs="0"/&gt;
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
    "getSearchResultsResult"
})
@XmlRootElement(name = "GetSearchResultsResponse")
public class GetSearchResultsResponse {

    @XmlElement(name = "GetSearchResultsResult")
    protected MemberSearchResults getSearchResultsResult;

    /**
     * Gets the value of the getSearchResultsResult property.
     * 
     * @return
     *     possible object is
     *     {@link MemberSearchResults }
     *     
     */
    public MemberSearchResults getGetSearchResultsResult() {
        return getSearchResultsResult;
    }

    /**
     * Sets the value of the getSearchResultsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link MemberSearchResults }
     *     
     */
    public void setGetSearchResultsResult(MemberSearchResults value) {
        this.getSearchResultsResult = value;
    }

}
