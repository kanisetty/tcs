
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for ServerInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ServerInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Core.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="CharacterEncoding" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="CurrentLocaleSuffix" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="DomainAccessEnabled" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="IsMultiByte" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="LanguageCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ServerDateTime" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="ServerVersion" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ServerVersionMajor" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ServerVersionMicro" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="ServerVersionMinor" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ServerInfo", propOrder = {
    "characterEncoding",
    "currentLocaleSuffix",
    "domainAccessEnabled",
    "isMultiByte",
    "languageCode",
    "serverDateTime",
    "serverVersion",
    "serverVersionMajor",
    "serverVersionMicro",
    "serverVersionMinor"
})
public class ServerInfo
    extends ServiceDataObject
{

    @XmlElement(name = "CharacterEncoding")
    protected int characterEncoding;
    @XmlElement(name = "CurrentLocaleSuffix")
    protected String currentLocaleSuffix;
    @XmlElement(name = "DomainAccessEnabled")
    protected boolean domainAccessEnabled;
    @XmlElement(name = "IsMultiByte")
    protected boolean isMultiByte;
    @XmlElement(name = "LanguageCode")
    protected String languageCode;
    @XmlElement(name = "ServerDateTime", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar serverDateTime;
    @XmlElement(name = "ServerVersion")
    protected String serverVersion;
    @XmlElement(name = "ServerVersionMajor")
    protected int serverVersionMajor;
    @XmlElement(name = "ServerVersionMicro")
    protected int serverVersionMicro;
    @XmlElement(name = "ServerVersionMinor")
    protected int serverVersionMinor;

    /**
     * Gets the value of the characterEncoding property.
     * 
     */
    public int getCharacterEncoding() {
        return characterEncoding;
    }

    /**
     * Sets the value of the characterEncoding property.
     * 
     */
    public void setCharacterEncoding(int value) {
        this.characterEncoding = value;
    }

    /**
     * Gets the value of the currentLocaleSuffix property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentLocaleSuffix() {
        return currentLocaleSuffix;
    }

    /**
     * Sets the value of the currentLocaleSuffix property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentLocaleSuffix(String value) {
        this.currentLocaleSuffix = value;
    }

    /**
     * Gets the value of the domainAccessEnabled property.
     * 
     */
    public boolean isDomainAccessEnabled() {
        return domainAccessEnabled;
    }

    /**
     * Sets the value of the domainAccessEnabled property.
     * 
     */
    public void setDomainAccessEnabled(boolean value) {
        this.domainAccessEnabled = value;
    }

    /**
     * Gets the value of the isMultiByte property.
     * 
     */
    public boolean isIsMultiByte() {
        return isMultiByte;
    }

    /**
     * Sets the value of the isMultiByte property.
     * 
     */
    public void setIsMultiByte(boolean value) {
        this.isMultiByte = value;
    }

    /**
     * Gets the value of the languageCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLanguageCode() {
        return languageCode;
    }

    /**
     * Sets the value of the languageCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLanguageCode(String value) {
        this.languageCode = value;
    }

    /**
     * Gets the value of the serverDateTime property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getServerDateTime() {
        return serverDateTime;
    }

    /**
     * Sets the value of the serverDateTime property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setServerDateTime(XMLGregorianCalendar value) {
        this.serverDateTime = value;
    }

    /**
     * Gets the value of the serverVersion property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServerVersion() {
        return serverVersion;
    }

    /**
     * Sets the value of the serverVersion property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServerVersion(String value) {
        this.serverVersion = value;
    }

    /**
     * Gets the value of the serverVersionMajor property.
     * 
     */
    public int getServerVersionMajor() {
        return serverVersionMajor;
    }

    /**
     * Sets the value of the serverVersionMajor property.
     * 
     */
    public void setServerVersionMajor(int value) {
        this.serverVersionMajor = value;
    }

    /**
     * Gets the value of the serverVersionMicro property.
     * 
     */
    public int getServerVersionMicro() {
        return serverVersionMicro;
    }

    /**
     * Sets the value of the serverVersionMicro property.
     * 
     */
    public void setServerVersionMicro(int value) {
        this.serverVersionMicro = value;
    }

    /**
     * Gets the value of the serverVersionMinor property.
     * 
     */
    public int getServerVersionMinor() {
        return serverVersionMinor;
    }

    /**
     * Sets the value of the serverVersionMinor property.
     * 
     */
    public void setServerVersionMinor(int value) {
        this.serverVersionMinor = value;
    }

}
