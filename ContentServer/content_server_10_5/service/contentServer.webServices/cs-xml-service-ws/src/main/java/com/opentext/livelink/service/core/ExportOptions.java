
package com.opentext.livelink.service.core;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ExportOptions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ExportOptions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Core.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Acls" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="AttributeInfo" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CallbackHandlerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ChildDepth" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="Content" type="{urn:Core.service.livelink.opentext.com}ExportContent"/&gt;
 *         &lt;element name="ExtUserInfo" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="FollowAliases" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="HandlerName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NameSpaceTag" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NodeInfo" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Permissions" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Schema" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Scope" type="{urn:Core.service.livelink.opentext.com}ExportScope"/&gt;
 *         &lt;element name="StyleSheet" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Transform" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="VersionInfo" type="{urn:Core.service.livelink.opentext.com}ExportVersionInfo"/&gt;
 *         &lt;element name="VersionNumber" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="XmlAttributes" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ExportOptions", propOrder = {
    "acls",
    "attributeInfo",
    "callbackHandlerName",
    "childDepth",
    "content",
    "extUserInfo",
    "followAliases",
    "handlerName",
    "nameSpaceTag",
    "nodeInfo",
    "permissions",
    "schema",
    "scope",
    "styleSheet",
    "transform",
    "versionInfo",
    "versionNumber",
    "xmlAttributes"
})
public class ExportOptions
    extends ServiceDataObject
{

    @XmlElement(name = "Acls")
    protected boolean acls;
    @XmlElement(name = "AttributeInfo")
    protected boolean attributeInfo;
    @XmlElement(name = "CallbackHandlerName")
    protected String callbackHandlerName;
    @XmlElement(name = "ChildDepth")
    protected int childDepth;
    @XmlElement(name = "Content", required = true)
    @XmlSchemaType(name = "string")
    protected ExportContent content;
    @XmlElement(name = "ExtUserInfo")
    protected boolean extUserInfo;
    @XmlElement(name = "FollowAliases", required = true, type = Boolean.class, nillable = true)
    protected Boolean followAliases;
    @XmlElement(name = "HandlerName")
    protected String handlerName;
    @XmlElement(name = "NameSpaceTag")
    protected String nameSpaceTag;
    @XmlElement(name = "NodeInfo")
    protected boolean nodeInfo;
    @XmlElement(name = "Permissions")
    protected boolean permissions;
    @XmlElement(name = "Schema")
    protected boolean schema;
    @XmlElement(name = "Scope", required = true)
    @XmlSchemaType(name = "string")
    protected ExportScope scope;
    @XmlElement(name = "StyleSheet")
    protected String styleSheet;
    @XmlElement(name = "Transform")
    protected String transform;
    @XmlElement(name = "VersionInfo", required = true)
    @XmlSchemaType(name = "string")
    protected ExportVersionInfo versionInfo;
    @XmlElement(name = "VersionNumber")
    protected long versionNumber;
    @XmlElement(name = "XmlAttributes")
    protected List<String> xmlAttributes;

    /**
     * Gets the value of the acls property.
     * 
     */
    public boolean isAcls() {
        return acls;
    }

    /**
     * Sets the value of the acls property.
     * 
     */
    public void setAcls(boolean value) {
        this.acls = value;
    }

    /**
     * Gets the value of the attributeInfo property.
     * 
     */
    public boolean isAttributeInfo() {
        return attributeInfo;
    }

    /**
     * Sets the value of the attributeInfo property.
     * 
     */
    public void setAttributeInfo(boolean value) {
        this.attributeInfo = value;
    }

    /**
     * Gets the value of the callbackHandlerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCallbackHandlerName() {
        return callbackHandlerName;
    }

    /**
     * Sets the value of the callbackHandlerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCallbackHandlerName(String value) {
        this.callbackHandlerName = value;
    }

    /**
     * Gets the value of the childDepth property.
     * 
     */
    public int getChildDepth() {
        return childDepth;
    }

    /**
     * Sets the value of the childDepth property.
     * 
     */
    public void setChildDepth(int value) {
        this.childDepth = value;
    }

    /**
     * Gets the value of the content property.
     * 
     * @return
     *     possible object is
     *     {@link ExportContent }
     *     
     */
    public ExportContent getContent() {
        return content;
    }

    /**
     * Sets the value of the content property.
     * 
     * @param value
     *     allowed object is
     *     {@link ExportContent }
     *     
     */
    public void setContent(ExportContent value) {
        this.content = value;
    }

    /**
     * Gets the value of the extUserInfo property.
     * 
     */
    public boolean isExtUserInfo() {
        return extUserInfo;
    }

    /**
     * Sets the value of the extUserInfo property.
     * 
     */
    public void setExtUserInfo(boolean value) {
        this.extUserInfo = value;
    }

    /**
     * Gets the value of the followAliases property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isFollowAliases() {
        return followAliases;
    }

    /**
     * Sets the value of the followAliases property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setFollowAliases(Boolean value) {
        this.followAliases = value;
    }

    /**
     * Gets the value of the handlerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHandlerName() {
        return handlerName;
    }

    /**
     * Sets the value of the handlerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHandlerName(String value) {
        this.handlerName = value;
    }

    /**
     * Gets the value of the nameSpaceTag property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNameSpaceTag() {
        return nameSpaceTag;
    }

    /**
     * Sets the value of the nameSpaceTag property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNameSpaceTag(String value) {
        this.nameSpaceTag = value;
    }

    /**
     * Gets the value of the nodeInfo property.
     * 
     */
    public boolean isNodeInfo() {
        return nodeInfo;
    }

    /**
     * Sets the value of the nodeInfo property.
     * 
     */
    public void setNodeInfo(boolean value) {
        this.nodeInfo = value;
    }

    /**
     * Gets the value of the permissions property.
     * 
     */
    public boolean isPermissions() {
        return permissions;
    }

    /**
     * Sets the value of the permissions property.
     * 
     */
    public void setPermissions(boolean value) {
        this.permissions = value;
    }

    /**
     * Gets the value of the schema property.
     * 
     */
    public boolean isSchema() {
        return schema;
    }

    /**
     * Sets the value of the schema property.
     * 
     */
    public void setSchema(boolean value) {
        this.schema = value;
    }

    /**
     * Gets the value of the scope property.
     * 
     * @return
     *     possible object is
     *     {@link ExportScope }
     *     
     */
    public ExportScope getScope() {
        return scope;
    }

    /**
     * Sets the value of the scope property.
     * 
     * @param value
     *     allowed object is
     *     {@link ExportScope }
     *     
     */
    public void setScope(ExportScope value) {
        this.scope = value;
    }

    /**
     * Gets the value of the styleSheet property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStyleSheet() {
        return styleSheet;
    }

    /**
     * Sets the value of the styleSheet property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStyleSheet(String value) {
        this.styleSheet = value;
    }

    /**
     * Gets the value of the transform property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTransform() {
        return transform;
    }

    /**
     * Sets the value of the transform property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTransform(String value) {
        this.transform = value;
    }

    /**
     * Gets the value of the versionInfo property.
     * 
     * @return
     *     possible object is
     *     {@link ExportVersionInfo }
     *     
     */
    public ExportVersionInfo getVersionInfo() {
        return versionInfo;
    }

    /**
     * Sets the value of the versionInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link ExportVersionInfo }
     *     
     */
    public void setVersionInfo(ExportVersionInfo value) {
        this.versionInfo = value;
    }

    /**
     * Gets the value of the versionNumber property.
     * 
     */
    public long getVersionNumber() {
        return versionNumber;
    }

    /**
     * Sets the value of the versionNumber property.
     * 
     */
    public void setVersionNumber(long value) {
        this.versionNumber = value;
    }

    /**
     * Gets the value of the xmlAttributes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the xmlAttributes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getXmlAttributes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getXmlAttributes() {
        if (xmlAttributes == null) {
            xmlAttributes = new ArrayList<String>();
        }
        return this.xmlAttributes;
    }

}
