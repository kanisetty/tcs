
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for GetNodesInContainerOptions complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetNodesInContainerOptions"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:DocMan.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="MaxDepth" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="MaxResults" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetNodesInContainerOptions", propOrder = {
    "maxDepth",
    "maxResults"
})
public class GetNodesInContainerOptions
    extends ServiceDataObject
{

    @XmlElement(name = "MaxDepth")
    protected int maxDepth;
    @XmlElement(name = "MaxResults")
    protected int maxResults;

    /**
     * Gets the value of the maxDepth property.
     * 
     */
    public int getMaxDepth() {
        return maxDepth;
    }

    /**
     * Sets the value of the maxDepth property.
     * 
     */
    public void setMaxDepth(int value) {
        this.maxDepth = value;
    }

    /**
     * Gets the value of the maxResults property.
     * 
     */
    public int getMaxResults() {
        return maxResults;
    }

    /**
     * Sets the value of the maxResults property.
     * 
     */
    public void setMaxResults(int value) {
        this.maxResults = value;
    }

}
