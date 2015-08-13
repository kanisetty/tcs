
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
 *         &lt;element name="projectInfo" type="{urn:Collaboration.service.livelink.opentext.com}ProjectInfo" minOccurs="0"/&gt;
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
    "projectInfo"
})
@XmlRootElement(name = "UpdateProject")
public class UpdateProject {

    protected ProjectInfo projectInfo;

    /**
     * Gets the value of the projectInfo property.
     * 
     * @return
     *     possible object is
     *     {@link ProjectInfo }
     *     
     */
    public ProjectInfo getProjectInfo() {
        return projectInfo;
    }

    /**
     * Sets the value of the projectInfo property.
     * 
     * @param value
     *     allowed object is
     *     {@link ProjectInfo }
     *     
     */
    public void setProjectInfo(ProjectInfo value) {
        this.projectInfo = value;
    }

}
