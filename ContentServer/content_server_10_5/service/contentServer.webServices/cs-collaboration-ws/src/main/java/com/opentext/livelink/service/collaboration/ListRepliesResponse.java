
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
 *         &lt;element name="ListRepliesResult" type="{urn:Collaboration.service.livelink.opentext.com}ReplyInfo" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "listRepliesResult"
})
@XmlRootElement(name = "ListRepliesResponse")
public class ListRepliesResponse {

    @XmlElement(name = "ListRepliesResult", nillable = true)
    protected List<ReplyInfo> listRepliesResult;

    /**
     * Gets the value of the listRepliesResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listRepliesResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListRepliesResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ReplyInfo }
     * 
     * 
     */
    public List<ReplyInfo> getListRepliesResult() {
        if (listRepliesResult == null) {
            listRepliesResult = new ArrayList<ReplyInfo>();
        }
        return this.listRepliesResult;
    }

}
