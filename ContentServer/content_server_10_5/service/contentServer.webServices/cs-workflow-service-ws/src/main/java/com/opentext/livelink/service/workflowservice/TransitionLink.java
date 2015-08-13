
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TransitionLink complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TransitionLink"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="DestinationActivity" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="SourceActivity" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="TransitionType" type="{urn:WorkflowService.service.livelink.opentext.com}TransitionType"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TransitionLink", propOrder = {
    "destinationActivity",
    "sourceActivity",
    "transitionType"
})
public class TransitionLink
    extends ServiceDataObject
{

    @XmlElement(name = "DestinationActivity")
    protected int destinationActivity;
    @XmlElement(name = "SourceActivity")
    protected int sourceActivity;
    @XmlElement(name = "TransitionType", required = true)
    @XmlSchemaType(name = "string")
    protected TransitionType transitionType;

    /**
     * Gets the value of the destinationActivity property.
     * 
     */
    public int getDestinationActivity() {
        return destinationActivity;
    }

    /**
     * Sets the value of the destinationActivity property.
     * 
     */
    public void setDestinationActivity(int value) {
        this.destinationActivity = value;
    }

    /**
     * Gets the value of the sourceActivity property.
     * 
     */
    public int getSourceActivity() {
        return sourceActivity;
    }

    /**
     * Sets the value of the sourceActivity property.
     * 
     */
    public void setSourceActivity(int value) {
        this.sourceActivity = value;
    }

    /**
     * Gets the value of the transitionType property.
     * 
     * @return
     *     possible object is
     *     {@link TransitionType }
     *     
     */
    public TransitionType getTransitionType() {
        return transitionType;
    }

    /**
     * Sets the value of the transitionType property.
     * 
     * @param value
     *     allowed object is
     *     {@link TransitionType }
     *     
     */
    public void setTransitionType(TransitionType value) {
        this.transitionType = value;
    }

}
