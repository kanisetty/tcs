
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
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
 *         &lt;element name="startData" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessStartData" minOccurs="0"/&gt;
 *         &lt;element name="attachments" type="{http://www.w3.org/2001/XMLSchema}long" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="memberRoleIDs" type="{http://www.w3.org/2001/XMLSchema}long" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "startData",
    "attachments",
    "memberRoleIDs"
})
@XmlRootElement(name = "StartProcess")
public class StartProcess {

    protected ProcessStartData startData;
    @XmlElement(type = Long.class)
    protected List<Long> attachments;
    @XmlElement(type = Long.class)
    protected List<Long> memberRoleIDs;

    /**
     * Gets the value of the startData property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessStartData }
     *     
     */
    public ProcessStartData getStartData() {
        return startData;
    }

    /**
     * Sets the value of the startData property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessStartData }
     *     
     */
    public void setStartData(ProcessStartData value) {
        this.startData = value;
    }

    /**
     * Gets the value of the attachments property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the attachments property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAttachments().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Long }
     * 
     * 
     */
    public List<Long> getAttachments() {
        if (attachments == null) {
            attachments = new ArrayList<Long>();
        }
        return this.attachments;
    }

    /**
     * Gets the value of the memberRoleIDs property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the memberRoleIDs property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getMemberRoleIDs().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Long }
     * 
     * 
     */
    public List<Long> getMemberRoleIDs() {
        if (memberRoleIDs == null) {
            memberRoleIDs = new ArrayList<Long>();
        }
        return this.memberRoleIDs;
    }

}
