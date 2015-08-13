
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for WorkItemActions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WorkItemActions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="AvailableDispositions" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="CanDelegate" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="CanSendForReview" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="MustAuthenticate" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WorkItemActions", propOrder = {
    "availableDispositions",
    "canDelegate",
    "canSendForReview",
    "mustAuthenticate"
})
public class WorkItemActions
    extends ServiceDataObject
{

    @XmlElement(name = "AvailableDispositions")
    protected List<String> availableDispositions;
    @XmlElement(name = "CanDelegate")
    protected boolean canDelegate;
    @XmlElement(name = "CanSendForReview")
    protected boolean canSendForReview;
    @XmlElement(name = "MustAuthenticate")
    protected boolean mustAuthenticate;

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
     * Gets the value of the canDelegate property.
     * 
     */
    public boolean isCanDelegate() {
        return canDelegate;
    }

    /**
     * Sets the value of the canDelegate property.
     * 
     */
    public void setCanDelegate(boolean value) {
        this.canDelegate = value;
    }

    /**
     * Gets the value of the canSendForReview property.
     * 
     */
    public boolean isCanSendForReview() {
        return canSendForReview;
    }

    /**
     * Sets the value of the canSendForReview property.
     * 
     */
    public void setCanSendForReview(boolean value) {
        this.canSendForReview = value;
    }

    /**
     * Gets the value of the mustAuthenticate property.
     * 
     */
    public boolean isMustAuthenticate() {
        return mustAuthenticate;
    }

    /**
     * Sets the value of the mustAuthenticate property.
     * 
     */
    public void setMustAuthenticate(boolean value) {
        this.mustAuthenticate = value;
    }

}
