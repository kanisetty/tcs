
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
 *         &lt;element name="processDef" type="{urn:WorkflowService.service.livelink.opentext.com}ProcessDefinition" minOccurs="0"/&gt;
 *         &lt;element name="processName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "processDef",
    "processName",
    "attachments",
    "memberRoleIDs"
})
@XmlRootElement(name = "CreateProcess")
public class CreateProcess {

    protected ProcessDefinition processDef;
    protected String processName;
    @XmlElement(type = Long.class)
    protected List<Long> attachments;
    @XmlElement(type = Long.class)
    protected List<Long> memberRoleIDs;

    /**
     * Gets the value of the processDef property.
     * 
     * @return
     *     possible object is
     *     {@link ProcessDefinition }
     *     
     */
    public ProcessDefinition getProcessDef() {
        return processDef;
    }

    /**
     * Sets the value of the processDef property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProcessDefinition }
     *     
     */
    public void setProcessDef(ProcessDefinition value) {
        this.processDef = value;
    }

    /**
     * Gets the value of the processName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProcessName() {
        return processName;
    }

    /**
     * Sets the value of the processName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProcessName(String value) {
        this.processName = value;
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
