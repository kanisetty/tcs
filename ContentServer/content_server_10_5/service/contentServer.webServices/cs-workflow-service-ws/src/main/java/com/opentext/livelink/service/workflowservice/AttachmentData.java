
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for AttachmentData complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="AttachmentData"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ApplicationData"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="ContainerID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "AttachmentData", propOrder = {
    "containerID"
})
public class AttachmentData
    extends ApplicationData
{

    @XmlElement(name = "ContainerID")
    protected long containerID;

    /**
     * Gets the value of the containerID property.
     * 
     */
    public long getContainerID() {
        return containerID;
    }

    /**
     * Sets the value of the containerID property.
     * 
     */
    public void setContainerID(long value) {
        this.containerID = value;
    }

}
