
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PrimitiveAttribute complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PrimitiveAttribute"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:DocMan.service.livelink.opentext.com}Attribute"&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PrimitiveAttribute")
@XmlSeeAlso({
    ItemReferenceAttribute.class,
    MultiLineAttribute.class,
    UserAttribute.class,
    StringAttribute.class,
    IntegerAttribute.class,
    DateAttribute.class,
    BooleanAttribute.class,
    RealAttribute.class
})
public class PrimitiveAttribute
    extends Attribute
{


}
