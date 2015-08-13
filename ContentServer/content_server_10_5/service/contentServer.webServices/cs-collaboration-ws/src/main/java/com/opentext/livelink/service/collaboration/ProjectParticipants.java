
package com.opentext.livelink.service.collaboration;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.memberservice.Member;


/**
 * <p>Java class for ProjectParticipants complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ProjectParticipants"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Coordinators" type="{urn:MemberService.service.livelink.opentext.com}Member" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="Guests" type="{urn:MemberService.service.livelink.opentext.com}Member" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="Members" type="{urn:MemberService.service.livelink.opentext.com}Member" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="ProjectID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ProjectParticipants", propOrder = {
    "coordinators",
    "guests",
    "members",
    "projectID"
})
public class ProjectParticipants
    extends ServiceDataObject
{

    @XmlElement(name = "Coordinators")
    protected List<Member> coordinators;
    @XmlElement(name = "Guests")
    protected List<Member> guests;
    @XmlElement(name = "Members")
    protected List<Member> members;
    @XmlElement(name = "ProjectID")
    protected long projectID;

    /**
     * Gets the value of the coordinators property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the coordinators property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCoordinators().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Member }
     * 
     * 
     */
    public List<Member> getCoordinators() {
        if (coordinators == null) {
            coordinators = new ArrayList<Member>();
        }
        return this.coordinators;
    }

    /**
     * Gets the value of the guests property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the guests property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getGuests().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Member }
     * 
     * 
     */
    public List<Member> getGuests() {
        if (guests == null) {
            guests = new ArrayList<Member>();
        }
        return this.guests;
    }

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
     * Gets the value of the projectID property.
     * 
     */
    public long getProjectID() {
        return projectID;
    }

    /**
     * Sets the value of the projectID property.
     * 
     */
    public void setProjectID(long value) {
        this.projectID = value;
    }

}
