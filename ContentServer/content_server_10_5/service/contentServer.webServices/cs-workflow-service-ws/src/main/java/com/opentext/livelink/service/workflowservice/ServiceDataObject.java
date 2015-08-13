
package com.opentext.livelink.service.workflowservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServiceDataObject complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ServiceDataObject"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ServiceDataObject")
@XmlSeeAlso({
    ProcessDefinition.class,
    ProcessInstance.class,
    ProcessResult.class,
    ProcessStartData.class,
    WorkItemDetails.class,
    ProcessSearchOptions.class,
    ProcessEvent.class,
    WorkItemResult.class,
    ActivityInstance.class,
    TransitionLink.class,
    FormDataInstance.class,
    ActivityComment.class,
    ApplicationData.class,
    ActivityPermissions.class,
    Activity.class,
    ProcessData.class,
    WorkItemActions.class,
    WorkItem.class,
    WorkItemPriorityObject.class,
    ProcessStatusObject.class
})
public abstract class ServiceDataObject {


}
