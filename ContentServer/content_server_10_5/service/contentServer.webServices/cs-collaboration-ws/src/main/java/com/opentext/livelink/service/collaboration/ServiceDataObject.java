
package com.opentext.livelink.service.collaboration;

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
    NewsInfo.class,
    ProjectInfo.class,
    ProjectRoleUpdateInfo.class,
    ChannelInfo.class,
    DiscussionInfo.class,
    TaskListInfo.class,
    Assignment.class,
    ProjectParticipants.class,
    DiscussionReadList.class,
    DiscussionItem.class,
    UnreadInfo.class,
    TaskListItem.class,
    CollaborationAttachment.class
})
public abstract class ServiceDataObject {


}
