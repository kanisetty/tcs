
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DateFormat complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DateFormat"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Core.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="DateOrder" type="{urn:Core.service.livelink.opentext.com}DateOrder"/&gt;
 *         &lt;element name="FormatName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Is24HrClock" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="MonthFormat" type="{urn:Core.service.livelink.opentext.com}MonthFormat"/&gt;
 *         &lt;element name="Separator1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Separator2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="YearFormat" type="{urn:Core.service.livelink.opentext.com}YearFormat"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DateFormat", propOrder = {
    "dateOrder",
    "formatName",
    "is24HrClock",
    "monthFormat",
    "separator1",
    "separator2",
    "yearFormat"
})
public class DateFormat
    extends ServiceDataObject
{

    @XmlElement(name = "DateOrder", required = true)
    @XmlSchemaType(name = "string")
    protected DateOrder dateOrder;
    @XmlElement(name = "FormatName")
    protected String formatName;
    @XmlElement(name = "Is24HrClock")
    protected boolean is24HrClock;
    @XmlElement(name = "MonthFormat", required = true)
    @XmlSchemaType(name = "string")
    protected MonthFormat monthFormat;
    @XmlElement(name = "Separator1")
    protected String separator1;
    @XmlElement(name = "Separator2")
    protected String separator2;
    @XmlElement(name = "YearFormat", required = true)
    @XmlSchemaType(name = "string")
    protected YearFormat yearFormat;

    /**
     * Gets the value of the dateOrder property.
     * 
     * @return
     *     possible object is
     *     {@link DateOrder }
     *     
     */
    public DateOrder getDateOrder() {
        return dateOrder;
    }

    /**
     * Sets the value of the dateOrder property.
     * 
     * @param value
     *     allowed object is
     *     {@link DateOrder }
     *     
     */
    public void setDateOrder(DateOrder value) {
        this.dateOrder = value;
    }

    /**
     * Gets the value of the formatName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFormatName() {
        return formatName;
    }

    /**
     * Sets the value of the formatName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFormatName(String value) {
        this.formatName = value;
    }

    /**
     * Gets the value of the is24HrClock property.
     * 
     */
    public boolean isIs24HrClock() {
        return is24HrClock;
    }

    /**
     * Sets the value of the is24HrClock property.
     * 
     */
    public void setIs24HrClock(boolean value) {
        this.is24HrClock = value;
    }

    /**
     * Gets the value of the monthFormat property.
     * 
     * @return
     *     possible object is
     *     {@link MonthFormat }
     *     
     */
    public MonthFormat getMonthFormat() {
        return monthFormat;
    }

    /**
     * Sets the value of the monthFormat property.
     * 
     * @param value
     *     allowed object is
     *     {@link MonthFormat }
     *     
     */
    public void setMonthFormat(MonthFormat value) {
        this.monthFormat = value;
    }

    /**
     * Gets the value of the separator1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSeparator1() {
        return separator1;
    }

    /**
     * Sets the value of the separator1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSeparator1(String value) {
        this.separator1 = value;
    }

    /**
     * Gets the value of the separator2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSeparator2() {
        return separator2;
    }

    /**
     * Sets the value of the separator2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSeparator2(String value) {
        this.separator2 = value;
    }

    /**
     * Gets the value of the yearFormat property.
     * 
     * @return
     *     possible object is
     *     {@link YearFormat }
     *     
     */
    public YearFormat getYearFormat() {
        return yearFormat;
    }

    /**
     * Sets the value of the yearFormat property.
     * 
     * @param value
     *     allowed object is
     *     {@link YearFormat }
     *     
     */
    public void setYearFormat(YearFormat value) {
        this.yearFormat = value;
    }

}
