
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ProcessDefinition complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProcessDefinition"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Activities" type="{urn:WorkflowService.service.livelink.opentext.com}Activity" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="ApplicationData" type="{urn:WorkflowService.service.livelink.opentext.com}ApplicationData" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="CompleteAction" type="{urn:WorkflowService.service.livelink.opentext.com}ActionOnComplete"/&gt;
 *         &lt;element name="DeleteMap" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Description" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="EmailAction" type="{urn:WorkflowService.service.livelink.opentext.com}EmailAttachmentAction"/&gt;
 *         &lt;element name="Message" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="ObjectID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="ResumeOnComplete" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Roles" type="{http://www.w3.org/2001/XMLSchema}string" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="SkipWeekends" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="Title" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TransitionLinks" type="{urn:WorkflowService.service.livelink.opentext.com}TransitionLink" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProcessDefinition", propOrder = {
    "activities",
    "applicationData",
    "completeAction",
    "deleteMap",
    "description",
    "emailAction",
    "message",
    "objectID",
    "resumeOnComplete",
    "roles",
    "skipWeekends",
    "title",
    "transitionLinks"
})
public class ProcessDefinition
    extends ServiceDataObject
{

    @XmlElement(name = "Activities")
    protected List<Activity> activities;
    @XmlElement(name = "ApplicationData")
    protected List<ApplicationData> applicationData;
    @XmlElement(name = "CompleteAction", required = true)
    @XmlSchemaType(name = "string")
    protected ActionOnComplete completeAction;
    @XmlElement(name = "DeleteMap", required = true, type = Boolean.class, nillable = true)
    protected Boolean deleteMap;
    @XmlElement(name = "Description")
    protected String description;
    @XmlElement(name = "EmailAction", required = true)
    @XmlSchemaType(name = "string")
    protected EmailAttachmentAction emailAction;
    @XmlElement(name = "Message")
    protected String message;
    @XmlElement(name = "ObjectID")
    protected long objectID;
    @XmlElement(name = "ResumeOnComplete", required = true, type = Boolean.class, nillable = true)
    protected Boolean resumeOnComplete;
    @XmlElement(name = "Roles")
    protected List<String> roles;
    @XmlElement(name = "SkipWeekends", required = true, type = Boolean.class, nillable = true)
    protected Boolean skipWeekends;
    @XmlElement(name = "Title")
    protected String title;
    @XmlElement(name = "TransitionLinks")
    protected List<TransitionLink> transitionLinks;

    /**
     * Gets the value of the activities property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the activities property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getActivities().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Activity }
     * 
     * 
     */
    public List<Activity> getActivities() {
        if (activities == null) {
            activities = new ArrayList<Activity>();
        }
        return this.activities;
    }

    /**
     * Gets the value of the applicationData property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the applicationData property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getApplicationData().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ApplicationData }
     * 
     * 
     */
    public List<ApplicationData> getApplicationData() {
        if (applicationData == null) {
            applicationData = new ArrayList<ApplicationData>();
        }
        return this.applicationData;
    }

    /**
     * Gets the value of the completeAction property.
     * 
     * @return
     *     possible object is
     *     {@link ActionOnComplete }
     *     
     */
    public ActionOnComplete getCompleteAction() {
        return completeAction;
    }

    /**
     * Sets the value of the completeAction property.
     * 
     * @param value
     *     allowed object is
     *     {@link ActionOnComplete }
     *     
     */
    public void setCompleteAction(ActionOnComplete value) {
        this.completeAction = value;
    }

    /**
     * Gets the value of the deleteMap property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isDeleteMap() {
        return deleteMap;
    }

    /**
     * Sets the value of the deleteMap property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setDeleteMap(Boolean value) {
        this.deleteMap = value;
    }

    /**
     * Gets the value of the description property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the value of the description property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescription(String value) {
        this.description = value;
    }

    /**
     * Gets the value of the emailAction property.
     * 
     * @return
     *     possible object is
     *     {@link EmailAttachmentAction }
     *     
     */
    public EmailAttachmentAction getEmailAction() {
        return emailAction;
    }

    /**
     * Sets the value of the emailAction property.
     * 
     * @param value
     *     allowed object is
     *     {@link EmailAttachmentAction }
     *     
     */
    public void setEmailAction(EmailAttachmentAction value) {
        this.emailAction = value;
    }

    /**
     * Gets the value of the message property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the value of the message property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMessage(String value) {
        this.message = value;
    }

    /**
     * Gets the value of the objectID property.
     * 
     */
    public long getObjectID() {
        return objectID;
    }

    /**
     * Sets the value of the objectID property.
     * 
     */
    public void setObjectID(long value) {
        this.objectID = value;
    }

    /**
     * Gets the value of the resumeOnComplete property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isResumeOnComplete() {
        return resumeOnComplete;
    }

    /**
     * Sets the value of the resumeOnComplete property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setResumeOnComplete(Boolean value) {
        this.resumeOnComplete = value;
    }

    /**
     * Gets the value of the roles property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the roles property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRoles().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getRoles() {
        if (roles == null) {
            roles = new ArrayList<String>();
        }
        return this.roles;
    }

    /**
     * Gets the value of the skipWeekends property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public Boolean isSkipWeekends() {
        return skipWeekends;
    }

    /**
     * Sets the value of the skipWeekends property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setSkipWeekends(Boolean value) {
        this.skipWeekends = value;
    }

    /**
     * Gets the value of the title property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the value of the title property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTitle(String value) {
        this.title = value;
    }

    /**
     * Gets the value of the transitionLinks property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the transitionLinks property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getTransitionLinks().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link TransitionLink }
     * 
     * 
     */
    public List<TransitionLink> getTransitionLinks() {
        if (transitionLinks == null) {
            transitionLinks = new ArrayList<TransitionLink>();
        }
        return this.transitionLinks;
    }

}
