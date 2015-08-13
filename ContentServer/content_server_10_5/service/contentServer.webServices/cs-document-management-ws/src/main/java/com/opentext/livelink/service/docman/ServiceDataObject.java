
package com.opentext.livelink.service.docman;

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
    CollectionItem.class,
    NodeRight.class,
    ReportResult.class,
    Metadata.class,
    NodeRights.class,
    AttributeGroupDefinition.class,
    MultilingualMetadata.class,
    Node.class,
    NodeRightUpdateInfo.class,
    Version.class,
    CategoryItemsUpgradeInfo.class,
    NodeAuditRecord.class,
    GetNodesInContainerOptions.class,
    PagedNodeAuditData.class,
    CompoundDocRelease.class,
    NodePageSpecification.class,
    NodePageResult.class,
    MoveOptions.class,
    NodePosition.class,
    CopyOptions.class,
    AttributeGroup.class,
    MetadataLanguage.class,
    NodePermissions.class,
    Attribute.class,
    NodeContainerInfo.class,
    NodeFeature.class,
    NodeReferenceInfo.class,
    NodeReservationInfo.class,
    NodeVersionInfo.class
})
public abstract class ServiceDataObject {


}
