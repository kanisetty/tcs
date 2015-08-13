
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.docman.Node;


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
 *         &lt;element name="CreateTaskListResult" type="{urn:DocMan.service.livelink.opentext.com}Node" minOccurs="0"/&gt;
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
    "createTaskListResult"
})
@XmlRootElement(name = "CreateTaskListResponse")
public class CreateTaskListResponse {

    @XmlElement(name = "CreateTaskListResult")
    protected Node createTaskListResult;

    /**
     * Gets the value of the createTaskListResult property.
     * 
     * @return
     *     possible object is
     *     {@link Node }
     *     
     */
    public Node getCreateTaskListResult() {
        return createTaskListResult;
    }

    /**
     * Sets the value of the createTaskListResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link Node }
     *     
     */
    public void setCreateTaskListResult(Node value) {
        this.createTaskListResult = value;
    }

}
