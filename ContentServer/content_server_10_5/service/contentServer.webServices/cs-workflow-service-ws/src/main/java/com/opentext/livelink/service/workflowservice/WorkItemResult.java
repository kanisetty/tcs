
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.opentext.livelink.service.core.PageHandle;


/**
 * <p>Java class for WorkItemResult complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="WorkItemResult"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="PageHandle" type="{urn:Core.service.livelink.opentext.com}PageHandle" minOccurs="0"/&gt;
 *         &lt;element name="WorkItems" type="{urn:WorkflowService.service.livelink.opentext.com}WorkItem" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "WorkItemResult", propOrder = {
    "pageHandle",
    "workItems"
})
public class WorkItemResult
    extends ServiceDataObject
{

    @XmlElement(name = "PageHandle")
    protected PageHandle pageHandle;
    @XmlElement(name = "WorkItems")
    protected List<WorkItem> workItems;

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

    /**
     * Gets the value of the workItems property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the workItems property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getWorkItems().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link WorkItem }
     * 
     * 
     */
    public List<WorkItem> getWorkItems() {
        if (workItems == null) {
            workItems = new ArrayList<WorkItem>();
        }
        return this.workItems;
    }

}
