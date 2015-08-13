
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
 *         &lt;element name="ListMilestonesResult" type="{urn:Collaboration.service.livelink.opentext.com}MilestoneInfo" maxOccurs="unbounded" minOccurs="0"/&gt;
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
    "listMilestonesResult"
})
@XmlRootElement(name = "ListMilestonesResponse")
public class ListMilestonesResponse {

    @XmlElement(name = "ListMilestonesResult", nillable = true)
    protected List<MilestoneInfo> listMilestonesResult;

    /**
     * Gets the value of the listMilestonesResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the listMilestonesResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getListMilestonesResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link MilestoneInfo }
     * 
     * 
     */
    public List<MilestoneInfo> getListMilestonesResult() {
        if (listMilestonesResult == null) {
            listMilestonesResult = new ArrayList<MilestoneInfo>();
        }
        return this.listMilestonesResult;
    }

}
