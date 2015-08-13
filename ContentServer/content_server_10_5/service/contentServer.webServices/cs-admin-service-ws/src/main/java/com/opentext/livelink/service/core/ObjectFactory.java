
package com.opentext.livelink.service.core;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.opentext.livelink.service.core package. 
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
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.opentext.livelink.service.core
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link GetDateFormats }
     * 
     */
    public GetDateFormats createGetDateFormats() {
        return new GetDateFormats();
    }

    /**
     * Create an instance of {@link GetDateFormatsResponse }
     * 
     */
    public GetDateFormatsResponse createGetDateFormatsResponse() {
        return new GetDateFormatsResponse();
    }

    /**
     * Create an instance of {@link DateFormat }
     * 
     */
    public DateFormat createDateFormat() {
        return new DateFormat();
    }

    /**
     * Create an instance of {@link GetServerInfo }
     * 
     */
    public GetServerInfo createGetServerInfo() {
        return new GetServerInfo();
    }

    /**
     * Create an instance of {@link GetServerInfoResponse }
     * 
     */
    public GetServerInfoResponse createGetServerInfoResponse() {
        return new GetServerInfoResponse();
    }

    /**
     * Create an instance of {@link ServerInfo }
     * 
     */
    public ServerInfo createServerInfo() {
        return new ServerInfo();
    }

    /**
     * Create an instance of {@link GetServiceList }
     * 
     */
    public GetServiceList createGetServiceList() {
        return new GetServiceList();
    }

    /**
     * Create an instance of {@link GetServiceListResponse }
     * 
     */
    public GetServiceListResponse createGetServiceListResponse() {
        return new GetServiceListResponse();
    }

    /**
     * Create an instance of {@link ServiceInfo }
     * 
     */
    public ServiceInfo createServiceInfo() {
        return new ServiceInfo();
    }

}
