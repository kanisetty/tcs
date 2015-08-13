
package com.opentext.livelink.service.workflowservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for FormData complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="FormData"&gt;
 *   &lt;complexContent&gt;
 *     &lt;extension base="{urn:WorkflowService.service.livelink.opentext.com}ApplicationData"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="Forms" type="{urn:WorkflowService.service.livelink.opentext.com}FormDataInstance" maxOccurs="unbounded" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/extension&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "FormData", propOrder = {
    "forms"
})
public class FormData
    extends ApplicationData
{

    @XmlElement(name = "Forms")
    protected List<FormDataInstance> forms;

    /**
     * Gets the value of the forms property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the forms property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getForms().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link FormDataInstance }
     * 
     * 
     */
    public List<FormDataInstance> getForms() {
        if (forms == null) {
            forms = new ArrayList<FormDataInstance>();
        }
        return this.forms;
    }

}
