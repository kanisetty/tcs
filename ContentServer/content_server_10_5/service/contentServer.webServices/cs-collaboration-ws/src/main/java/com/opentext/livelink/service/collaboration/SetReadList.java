
package com.opentext.livelink.service.collaboration;

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
 *         &lt;element name="discussionID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="readList" type="{urn:Collaboration.service.livelink.opentext.com}DiscussionReadList" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "discussionID",
    "readList"
})
@XmlRootElement(name = "SetReadList")
public class SetReadList {

    protected long discussionID;
    @XmlElement(nillable = true)
    protected List<DiscussionReadList> readList;

    /**
     * Gets the value of the discussionID property.
     * 
     */
    public long getDiscussionID() {
        return discussionID;
    }

    /**
     * Sets the value of the discussionID property.
     * 
     */
    public void setDiscussionID(long value) {
        this.discussionID = value;
    }

    /**
     * Gets the value of the readList property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the readList property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getReadList().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DiscussionReadList }
     * 
     * 
     */
    public List<DiscussionReadList> getReadList() {
        if (readList == null) {
            readList = new ArrayList<DiscussionReadList>();
        }
        return this.readList;
    }

}
