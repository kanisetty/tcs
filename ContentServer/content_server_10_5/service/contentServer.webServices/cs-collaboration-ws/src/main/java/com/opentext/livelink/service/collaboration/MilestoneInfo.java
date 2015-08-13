
package com.opentext.livelink.service.collaboration;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for MilestoneInfo complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MilestoneInfo"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:Collaboration.service.livelink.opentext.com}TaskListItem"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="ActualDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="Duration" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumActive" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumCancelled" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumCompleted" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumInprocess" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumIssue" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumLate" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumOnHold" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumPending" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="NumTasks" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="OriginalTargetDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *         &lt;element name="PercentCancelled" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentComplete" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentInprocess" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentIssue" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentLate" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentOnHold" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="PercentPending" type="{http://www.w3.org/2001/XMLSchema}double"/&gt;
 *         &lt;element name="Resources" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="TargetDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MilestoneInfo", propOrder = {
    "actualDate",
    "duration",
    "numActive",
    "numCancelled",
    "numCompleted",
    "numInprocess",
    "numIssue",
    "numLate",
    "numOnHold",
    "numPending",
    "numTasks",
    "originalTargetDate",
    "percentCancelled",
    "percentComplete",
    "percentInprocess",
    "percentIssue",
    "percentLate",
    "percentOnHold",
    "percentPending",
    "resources",
    "targetDate"
})
public class MilestoneInfo
    extends TaskListItem
{

    @XmlElement(name = "ActualDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar actualDate;
    @XmlElement(name = "Duration")
    protected int duration;
    @XmlElement(name = "NumActive")
    protected int numActive;
    @XmlElement(name = "NumCancelled")
    protected int numCancelled;
    @XmlElement(name = "NumCompleted")
    protected int numCompleted;
    @XmlElement(name = "NumInprocess")
    protected int numInprocess;
    @XmlElement(name = "NumIssue")
    protected int numIssue;
    @XmlElement(name = "NumLate")
    protected int numLate;
    @XmlElement(name = "NumOnHold")
    protected int numOnHold;
    @XmlElement(name = "NumPending")
    protected int numPending;
    @XmlElement(name = "NumTasks")
    protected int numTasks;
    @XmlElement(name = "OriginalTargetDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar originalTargetDate;
    @XmlElement(name = "PercentCancelled")
    protected double percentCancelled;
    @XmlElement(name = "PercentComplete")
    protected double percentComplete;
    @XmlElement(name = "PercentInprocess")
    protected double percentInprocess;
    @XmlElement(name = "PercentIssue")
    protected double percentIssue;
    @XmlElement(name = "PercentLate")
    protected double percentLate;
    @XmlElement(name = "PercentOnHold")
    protected double percentOnHold;
    @XmlElement(name = "PercentPending")
    protected double percentPending;
    @XmlElement(name = "Resources")
    protected int resources;
    @XmlElement(name = "TargetDate", required = true, nillable = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar targetDate;

    /**
     * Gets the value of the actualDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getActualDate() {
        return actualDate;
    }

    /**
     * Sets the value of the actualDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setActualDate(XMLGregorianCalendar value) {
        this.actualDate = value;
    }

    /**
     * Gets the value of the duration property.
     * 
     */
    public int getDuration() {
        return duration;
    }

    /**
     * Sets the value of the duration property.
     * 
     */
    public void setDuration(int value) {
        this.duration = value;
    }

    /**
     * Gets the value of the numActive property.
     * 
     */
    public int getNumActive() {
        return numActive;
    }

    /**
     * Sets the value of the numActive property.
     * 
     */
    public void setNumActive(int value) {
        this.numActive = value;
    }

    /**
     * Gets the value of the numCancelled property.
     * 
     */
    public int getNumCancelled() {
        return numCancelled;
    }

    /**
     * Sets the value of the numCancelled property.
     * 
     */
    public void setNumCancelled(int value) {
        this.numCancelled = value;
    }

    /**
     * Gets the value of the numCompleted property.
     * 
     */
    public int getNumCompleted() {
        return numCompleted;
    }

    /**
     * Sets the value of the numCompleted property.
     * 
     */
    public void setNumCompleted(int value) {
        this.numCompleted = value;
    }

    /**
     * Gets the value of the numInprocess property.
     * 
     */
    public int getNumInprocess() {
        return numInprocess;
    }

    /**
     * Sets the value of the numInprocess property.
     * 
     */
    public void setNumInprocess(int value) {
        this.numInprocess = value;
    }

    /**
     * Gets the value of the numIssue property.
     * 
     */
    public int getNumIssue() {
        return numIssue;
    }

    /**
     * Sets the value of the numIssue property.
     * 
     */
    public void setNumIssue(int value) {
        this.numIssue = value;
    }

    /**
     * Gets the value of the numLate property.
     * 
     */
    public int getNumLate() {
        return numLate;
    }

    /**
     * Sets the value of the numLate property.
     * 
     */
    public void setNumLate(int value) {
        this.numLate = value;
    }

    /**
     * Gets the value of the numOnHold property.
     * 
     */
    public int getNumOnHold() {
        return numOnHold;
    }

    /**
     * Sets the value of the numOnHold property.
     * 
     */
    public void setNumOnHold(int value) {
        this.numOnHold = value;
    }

    /**
     * Gets the value of the numPending property.
     * 
     */
    public int getNumPending() {
        return numPending;
    }

    /**
     * Sets the value of the numPending property.
     * 
     */
    public void setNumPending(int value) {
        this.numPending = value;
    }

    /**
     * Gets the value of the numTasks property.
     * 
     */
    public int getNumTasks() {
        return numTasks;
    }

    /**
     * Sets the value of the numTasks property.
     * 
     */
    public void setNumTasks(int value) {
        this.numTasks = value;
    }

    /**
     * Gets the value of the originalTargetDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getOriginalTargetDate() {
        return originalTargetDate;
    }

    /**
     * Sets the value of the originalTargetDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setOriginalTargetDate(XMLGregorianCalendar value) {
        this.originalTargetDate = value;
    }

    /**
     * Gets the value of the percentCancelled property.
     * 
     */
    public double getPercentCancelled() {
        return percentCancelled;
    }

    /**
     * Sets the value of the percentCancelled property.
     * 
     */
    public void setPercentCancelled(double value) {
        this.percentCancelled = value;
    }

    /**
     * Gets the value of the percentComplete property.
     * 
     */
    public double getPercentComplete() {
        return percentComplete;
    }

    /**
     * Sets the value of the percentComplete property.
     * 
     */
    public void setPercentComplete(double value) {
        this.percentComplete = value;
    }

    /**
     * Gets the value of the percentInprocess property.
     * 
     */
    public double getPercentInprocess() {
        return percentInprocess;
    }

    /**
     * Sets the value of the percentInprocess property.
     * 
     */
    public void setPercentInprocess(double value) {
        this.percentInprocess = value;
    }

    /**
     * Gets the value of the percentIssue property.
     * 
     */
    public double getPercentIssue() {
        return percentIssue;
    }

    /**
     * Sets the value of the percentIssue property.
     * 
     */
    public void setPercentIssue(double value) {
        this.percentIssue = value;
    }

    /**
     * Gets the value of the percentLate property.
     * 
     */
    public double getPercentLate() {
        return percentLate;
    }

    /**
     * Sets the value of the percentLate property.
     * 
     */
    public void setPercentLate(double value) {
        this.percentLate = value;
    }

    /**
     * Gets the value of the percentOnHold property.
     * 
     */
    public double getPercentOnHold() {
        return percentOnHold;
    }

    /**
     * Sets the value of the percentOnHold property.
     * 
     */
    public void setPercentOnHold(double value) {
        this.percentOnHold = value;
    }

    /**
     * Gets the value of the percentPending property.
     * 
     */
    public double getPercentPending() {
        return percentPending;
    }

    /**
     * Sets the value of the percentPending property.
     * 
     */
    public void setPercentPending(double value) {
        this.percentPending = value;
    }

    /**
     * Gets the value of the resources property.
     * 
     */
    public int getResources() {
        return resources;
    }

    /**
     * Sets the value of the resources property.
     * 
     */
    public void setResources(int value) {
        this.resources = value;
    }

    /**
     * Gets the value of the targetDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getTargetDate() {
        return targetDate;
    }

    /**
     * Sets the value of the targetDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setTargetDate(XMLGregorianCalendar value) {
        this.targetDate = value;
    }

}
