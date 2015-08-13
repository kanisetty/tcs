
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ActivityPermissions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ActivityPermissions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Authenticate" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="AvailableDispositions" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="DefaultDisposition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="Delegate" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="RequireDisposition" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="SeeAllComments" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="SendForReview" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ActivityPermissions", propOrder = {
    "authenticate",
    "availableDispositions",
    "defaultDisposition",
    "delegate",
    "requireDisposition",
    "seeAllComments",
    "sendForReview"
})
public class ActivityPermissions
    extends ServiceDataObject
{

    @XmlElement(name = "Authenticate")
    protected boolean authenticate;
    @XmlElement(name = "AvailableDispositions")
    protected List<String> availableDispositions;
    @XmlElement(name = "DefaultDisposition")
    protected String defaultDisposition;
    @XmlElement(name = "Delegate")
    protected boolean delegate;
    @XmlElement(name = "RequireDisposition")
    protected boolean requireDisposition;
    @XmlElement(name = "SeeAllComments")
    protected boolean seeAllComments;
    @XmlElement(name = "SendForReview")
    protected boolean sendForReview;

    /**
     * Gets the value of the authenticate property.
     * 
     */
    public boolean isAuthenticate() {
        return authenticate;
    }

    /**
     * Sets the value of the authenticate property.
     * 
     */
    public void setAuthenticate(boolean value) {
        this.authenticate = value;
    }

    /**
     * Gets the value of the availableDispositions property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the availableDispositions property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAvailableDispositions().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getAvailableDispositions() {
        if (availableDispositions == null) {
            availableDispositions = new ArrayList<String>();
        }
        return this.availableDispositions;
    }

    /**
     * Gets the value of the defaultDisposition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDefaultDisposition() {
        return defaultDisposition;
    }

    /**
     * Sets the value of the defaultDisposition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDefaultDisposition(String value) {
        this.defaultDisposition = value;
    }

    /**
     * Gets the value of the delegate property.
     * 
     */
    public boolean isDelegate() {
        return delegate;
    }

    /**
     * Sets the value of the delegate property.
     * 
     */
    public void setDelegate(boolean value) {
        this.delegate = value;
    }

    /**
     * Gets the value of the requireDisposition property.
     * 
     */
    public boolean isRequireDisposition() {
        return requireDisposition;
    }

    /**
     * Sets the value of the requireDisposition property.
     * 
     */
    public void setRequireDisposition(boolean value) {
        this.requireDisposition = value;
    }

    /**
     * Gets the value of the seeAllComments property.
     * 
     */
    public boolean isSeeAllComments() {
        return seeAllComments;
    }

    /**
     * Sets the value of the seeAllComments property.
     * 
     */
    public void setSeeAllComments(boolean value) {
        this.seeAllComments = value;
    }

    /**
     * Gets the value of the sendForReview property.
     * 
     */
    public boolean isSendForReview() {
        return sendForReview;
    }

    /**
     * Sets the value of the sendForReview property.
     * 
     */
    public void setSendForReview(boolean value) {
        this.sendForReview = value;
    }

}
