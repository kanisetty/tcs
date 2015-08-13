
package com.opentext.livelink.service.memberservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.core.PageHandle;


/**
 * <p>Java class for MemberSearchResults complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MemberSearchResults"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:MemberService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Members" type="{urn:MemberService.service.livelink.opentext.com}Member" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="PageHandle" type="{urn:Core.service.livelink.opentext.com}PageHandle" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MemberSearchResults", propOrder = {
    "members",
    "pageHandle"
})
public class MemberSearchResults
    extends ServiceDataObject
{

    @XmlElement(name = "Members")
    protected List<Member> members;
    @XmlElement(name = "PageHandle")
    protected PageHandle pageHandle;

    /**
     * Gets the value of the members property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the members property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getMembers().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Member }
     * 
     * 
     */
    public List<Member> getMembers() {
        if (members == null) {
            members = new ArrayList<Member>();
        }
        return this.members;
    }

    /**
     * Gets the value of the pageHandle property.
     * 
     * @return
     *     possible object is
     *     {@link PageHandle }
     *     
     */
    public PageHandle getPageHandle() {
        return pageHandle;
    }

    /**
     * Sets the value of the pageHandle property.
     * 
     * @param value
     *     allowed object is
     *     {@link PageHandle }
     *     
     */
    public void setPageHandle(PageHandle value) {
        this.pageHandle = value;
    }

}
