
package com.opentext.livelink.service.docman;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for NodePosition complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="NodePosition"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:DocMan.service.livelink.opentext.com}ServiceDataObject"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="NodeID" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *         &lt;element name="Position" type="{http://www.w3.org/2001/XMLSchema}long"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "NodePosition", propOrder = {
    "nodeID",
    "position"
})
public class NodePosition
    extends ServiceDataObject
{

    @XmlElement(name = "NodeID")
    protected long nodeID;
    @XmlElement(name = "Position")
    protected long position;

    /**
     * Gets the value of the nodeID property.
     * 
     */
    public long getNodeID() {
        return nodeID;
    }

    /**
     * Sets the value of the nodeID property.
     * 
     */
    public void setNodeID(long value) {
        this.nodeID = value;
    }

    /**
     * Gets the value of the position property.
     * 
     */
    public long getPosition() {
        return position;
    }

    /**
     * Sets the value of the position property.
     * 
     */
    public void setPosition(long value) {
        this.position = value;
    }

}
