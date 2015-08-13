
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
     * Create an instance of {@link AttributeGroupDefinition }
     * 
     */
    public AttributeGroupDefinition createAttributeGroupDefinition() {
        return new AttributeGroupDefinition();
    }

    /**
     * Create an instance of {@link Attribute }
     * 
     */
    public Attribute createAttribute() {
        return new Attribute();
    }

    /**
     * Create an instance of {@link SetAttribute }
     * 
     */
    public SetAttribute createSetAttribute() {
        return new SetAttribute();
    }

    /**
     * Create an instance of {@link PrimitiveAttribute }
     * 
     */
    public PrimitiveAttribute createPrimitiveAttribute() {
        return new PrimitiveAttribute();
    }

    /**
     * Create an instance of {@link ItemReferenceAttribute }
     * 
     */
    public ItemReferenceAttribute createItemReferenceAttribute() {
        return new ItemReferenceAttribute();
    }

    /**
     * Create an instance of {@link MultiLineAttribute }
     * 
     */
    public MultiLineAttribute createMultiLineAttribute() {
        return new MultiLineAttribute();
    }

    /**
     * Create an instance of {@link UserAttribute }
     * 
     */
    public UserAttribute createUserAttribute() {
        return new UserAttribute();
    }

    /**
     * Create an instance of {@link StringAttribute }
     * 
     */
    public StringAttribute createStringAttribute() {
        return new StringAttribute();
    }

    /**
     * Create an instance of {@link IntegerAttribute }
     * 
     */
    public IntegerAttribute createIntegerAttribute() {
        return new IntegerAttribute();
    }

    /**
     * Create an instance of {@link DateAttribute }
     * 
     */
    public DateAttribute createDateAttribute() {
        return new DateAttribute();
    }

    /**
     * Create an instance of {@link BooleanAttribute }
     * 
     */
    public BooleanAttribute createBooleanAttribute() {
        return new BooleanAttribute();
    }

    /**
     * Create an instance of {@link RealAttribute }
     * 
     */
    public RealAttribute createRealAttribute() {
        return new RealAttribute();
    }

}
