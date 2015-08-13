
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DiscussionReadList complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DiscussionReadList"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="FirstID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="LastID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DiscussionReadList", propOrder = {
    "firstID",
    "lastID"
})
public class DiscussionReadList
    extends ServiceDataObject
{

    @XmlElement(name = "FirstID")
    protected long firstID;
    @XmlElement(name = "LastID")
    protected long lastID;

    /**
     * Gets the value of the firstID property.
     * 
     */
    public long getFirstID() {
        return firstID;
    }

    /**
     * Sets the value of the firstID property.
     * 
     */
    public void setFirstID(long value) {
        this.firstID = value;
    }

    /**
     * Gets the value of the lastID property.
     * 
     */
    public long getLastID() {
        return lastID;
    }

    /**
     * Sets the value of the lastID property.
     * 
     */
    public void setLastID(long value) {
        this.lastID = value;
    }

}
