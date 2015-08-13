
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="taskGroupInfo" type="{urn:Collaboration.service.livelink.opentext.com}TaskGroupInfo" minOccurs="0"/&gt;
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
    "taskGroupInfo"
})
@XmlRootElement(name = "CreateTaskGroup")
public class CreateTaskGroup {

    protected TaskGroupInfo taskGroupInfo;

    /**
     * Gets the value of the taskGroupInfo property.
     * 
     * @return
     *     possible object is
     *     {@link TaskGroupInfo }
     *     
     */
    public TaskGroupInfo getTaskGroupInfo() {
        return taskGroupInfo;
    }

    /**
     * Sets the value of the taskGroupInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link TaskGroupInfo }
     *     
     */
    public void setTaskGroupInfo(TaskGroupInfo value) {
        this.taskGroupInfo = value;
    }

}
