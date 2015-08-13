
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.opentext.livelink.service.docman package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {


    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.opentext.livelink.service.docman
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link Node }
     * 
     */
    public Node createNode() {
        return new Node();
    }

    /**
     * Create an instance of {@link Version }
     * 
     */
    public Version createVersion() {
        return new Version();
    }

    /**
     * Create an instance of {@link Metadata }
     * 
     */
    public Metadata createMetadata() {
        return new Metadata();
    }

    /**
     * Create an instance of {@link AttributeGroup }
     * 
     */
    public AttributeGroup createAttributeGroup() {
        return new AttributeGroup();
    }

    /**
     * Create an instance of {@link NodeVersionInfo }
     * 
     */
    public NodeVersionInfo createNodeVersionInfo() {
        return new NodeVersionInfo();
    }

    /**
     * Create an instance of {@link NodeReservationInfo }
     * 
     */
    public NodeReservationInfo createNodeReservationInfo() {
        return new NodeReservationInfo();
    }

    /**
     * Create an instance of {@link NodeReferenceInfo }
     * 
     */
    public NodeReferenceInfo createNodeReferenceInfo() {
        return new NodeReferenceInfo();
    }

    /**
     * Create an instance of {@link NodePermissions }
     * 
     */
    public NodePermissions createNodePermissions() {
        return new NodePermissions();
    }

    /**
     * Create an instance of {@link NodeFeature }
     * 
     */
    public NodeFeature createNodeFeature() {
        return new NodeFeature();
    }

    /**
     * Create an instance of {@link NodeContainerInfo }
     * 
     */
    public NodeContainerInfo createNodeContainerInfo() {
        return new NodeContainerInfo();
    }

}
