
package com.opentext.livelink.service.searchservices;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.opentext.livelink.service.searchservices package. 
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
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.opentext.livelink.service.searchservices
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link ExtractObjects }
     * 
     */
    public ExtractObjects createExtractObjects() {
        return new ExtractObjects();
    }

    /**
     * Create an instance of {@link ExtractObjectsResponse }
     * 
     */
    public ExtractObjectsResponse createExtractObjectsResponse() {
        return new ExtractObjectsResponse();
    }

    /**
     * Create an instance of {@link ExtractResponse }
     * 
     */
    public ExtractResponse createExtractResponse() {
        return new ExtractResponse();
    }

    /**
     * Create an instance of {@link GetObjectsInDateRange }
     * 
     */
    public GetObjectsInDateRange createGetObjectsInDateRange() {
        return new GetObjectsInDateRange();
    }

    /**
     * Create an instance of {@link GetObjectsInDateRangeResponse }
     * 
     */
    public GetObjectsInDateRangeResponse createGetObjectsInDateRangeResponse() {
        return new GetObjectsInDateRangeResponse();
    }

    /**
     * Create an instance of {@link ExtractionFailure }
     * 
     */
    public ExtractionFailure createExtractionFailure() {
        return new ExtractionFailure();
    }

}
