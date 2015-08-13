
package com.opentext.livelink.service.memberservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for MemberSearchOptions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MemberSearchOptions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:MemberService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Column" type="{urn:MemberService.service.livelink.opentext.com}SearchColumn"/&gt;
 *         &lt;element name="DomainID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Filter" type="{urn:MemberService.service.livelink.opentext.com}SearchFilter"/&gt;
 *         &lt;element name="GroupID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Matching" type="{urn:MemberService.service.livelink.opentext.com}SearchMatching"/&gt;
 *         &lt;element name="PageSize" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Scope" type="{urn:MemberService.service.livelink.opentext.com}SearchScope"/&gt;
 *         &lt;element name="Search" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MemberSearchOptions", propOrder = {
    "column",
    "domainID",
    "filter",
    "groupID",
    "matching",
    "pageSize",
    "scope",
    "search"
})
public class MemberSearchOptions
    extends ServiceDataObject
{

    @XmlElement(name = "Column", required = true)
    @XmlSchemaType(name = "string")
    protected SearchColumn column;
    @XmlElement(name = "DomainID")
    protected long domainID;
    @XmlElement(name = "Filter", required = true)
    @XmlSchemaType(name = "string")
    protected SearchFilter filter;
    @XmlElement(name = "GroupID")
    protected long groupID;
    @XmlElement(name = "Matching", required = true)
    @XmlSchemaType(name = "string")
    protected SearchMatching matching;
    @XmlElement(name = "PageSize")
    protected int pageSize;
    @XmlElement(name = "Scope", required = true)
    @XmlSchemaType(name = "string")
    protected SearchScope scope;
    @XmlElement(name = "Search")
    protected String search;

    /**
     * Gets the value of the column property.
     * 
     * @return
     *     possible object is
     *     {@link SearchColumn }
     *     
     */
    public SearchColumn getColumn() {
        return column;
    }

    /**
     * Sets the value of the column property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchColumn }
     *     
     */
    public void setColumn(SearchColumn value) {
        this.column = value;
    }

    /**
     * Gets the value of the domainID property.
     * 
     */
    public long getDomainID() {
        return domainID;
    }

    /**
     * Sets the value of the domainID property.
     * 
     */
    public void setDomainID(long value) {
        this.domainID = value;
    }

    /**
     * Gets the value of the filter property.
     * 
     * @return
     *     possible object is
     *     {@link SearchFilter }
     *     
     */
    public SearchFilter getFilter() {
        return filter;
    }

    /**
     * Sets the value of the filter property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchFilter }
     *     
     */
    public void setFilter(SearchFilter value) {
        this.filter = value;
    }

    /**
     * Gets the value of the groupID property.
     * 
     */
    public long getGroupID() {
        return groupID;
    }

    /**
     * Sets the value of the groupID property.
     * 
     */
    public void setGroupID(long value) {
        this.groupID = value;
    }

    /**
     * Gets the value of the matching property.
     * 
     * @return
     *     possible object is
     *     {@link SearchMatching }
     *     
     */
    public SearchMatching getMatching() {
        return matching;
    }

    /**
     * Sets the value of the matching property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchMatching }
     *     
     */
    public void setMatching(SearchMatching value) {
        this.matching = value;
    }

    /**
     * Gets the value of the pageSize property.
     * 
     */
    public int getPageSize() {
        return pageSize;
    }

    /**
     * Sets the value of the pageSize property.
     * 
     */
    public void setPageSize(int value) {
        this.pageSize = value;
    }

    /**
     * Gets the value of the scope property.
     * 
     * @return
     *     possible object is
     *     {@link SearchScope }
     *     
     */
    public SearchScope getScope() {
        return scope;
    }

    /**
     * Sets the value of the scope property.
     * 
     * @param value
     *     allowed object is
     *     {@link SearchScope }
     *     
     */
    public void setScope(SearchScope value) {
        this.scope = value;
    }

    /**
     * Gets the value of the search property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSearch() {
        return search;
    }

    /**
     * Sets the value of the search property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSearch(String value) {
        this.search = value;
    }

}
