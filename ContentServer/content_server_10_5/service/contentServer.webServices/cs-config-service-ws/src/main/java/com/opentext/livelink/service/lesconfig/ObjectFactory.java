
package com.opentext.livelink.service.lesconfig;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.opentext.livelink.service.lesconfig package. 
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
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.opentext.livelink.service.lesconfig
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link Get }
     * 
     */
    public Get createGet() {
        return new Get();
    }

    /**
     * Create an instance of {@link GetResponse }
     * 
     */
    public GetResponse createGetResponse() {
        return new GetResponse();
    }

    /**
     * Create an instance of {@link GetChildren }
     * 
     */
    public GetChildren createGetChildren() {
        return new GetChildren();
    }

    /**
     * Create an instance of {@link GetChildrenResponse }
     * 
     */
    public GetChildrenResponse createGetChildrenResponse() {
        return new GetChildrenResponse();
    }

    /**
     * Create an instance of {@link GetHelp }
     * 
     */
    public GetHelp createGetHelp() {
        return new GetHelp();
    }

    /**
     * Create an instance of {@link GetHelpResponse }
     * 
     */
    public GetHelpResponse createGetHelpResponse() {
        return new GetHelpResponse();
    }

    /**
     * Create an instance of {@link Set }
     * 
     */
    public Set createSet() {
        return new Set();
    }

    /**
     * Create an instance of {@link SetResponse }
     * 
     */
    public SetResponse createSetResponse() {
        return new SetResponse();
    }

}
