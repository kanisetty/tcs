
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TaskGroupInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TaskGroupInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}TaskListItem"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="DefaultMilestone" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TaskGroupInfo", propOrder = {
    "defaultMilestone"
})
public class TaskGroupInfo
    extends TaskListItem
{

    @XmlElement(name = "DefaultMilestone")
    protected long defaultMilestone;

    /**
     * Gets the value of the defaultMilestone property.
     * 
     */
    public long getDefaultMilestone() {
        return defaultMilestone;
    }

    /**
     * Sets the value of the defaultMilestone property.
     * 
     */
    public void setDefaultMilestone(long value) {
        this.defaultMilestone = value;
    }

}
