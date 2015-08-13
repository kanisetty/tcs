
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProcessSearchOptions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessSearchOptions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Filter" type="{urn:WorkflowService.service.livelink.opentext.com}SearchFilter"/&gt;
 *         &lt;element name="PageSize" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="RetrieveActivities" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="RetrieveProcessData" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Where" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProcessSearchOptions", propOrder = {
    "filter",
    "pageSize",
    "retrieveActivities",
    "retrieveProcessData",
    "where"
})
public class ProcessSearchOptions
    extends ServiceDataObject
{

    @XmlElement(name = "Filter", required = true)
    @XmlSchemaType(name = "string")
    protected SearchFilter filter;
    @XmlElement(name = "PageSize")
    protected int pageSize;
    @XmlElement(name = "RetrieveActivities", required = true, type = Boolean.class, nillable = true)
    protected Boolean retrieveActivities;
    @XmlElement(name = "RetrieveProcessData", required = true, type = Boolean.class, nillable = true)
    protected Boolean retrieveProcessData;
    @XmlElement(name = "Where")
    protected String where;

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
     * Gets the value of the retrieveActivities property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isRetrieveActivities() {
        return retrieveActivities;
    }

    /**
     * Sets the value of the retrieveActivities property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setRetrieveActivities(Boolean value) {
        this.retrieveActivities = value;
    }

    /**
     * Gets the value of the retrieveProcessData property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isRetrieveProcessData() {
        return retrieveProcessData;
    }

    /**
     * Sets the value of the retrieveProcessData property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setRetrieveProcessData(Boolean value) {
        this.retrieveProcessData = value;
    }

    /**
     * Gets the value of the where property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWhere() {
        return where;
    }

    /**
     * Sets the value of the where property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWhere(String value) {
        this.where = value;
    }

}
