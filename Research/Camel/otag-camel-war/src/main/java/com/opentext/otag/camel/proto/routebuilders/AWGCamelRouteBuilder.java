package com.opentext.otag.camel.proto.routebuilders;

import com.opentext.otag.camel.proto.ProxyRoute;
import com.opentext.otag.camel.proto.ProxyRouteService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;

/**
 * Created by Pete on 22/05/2015.
 */
public class AWGCamelRouteBuilder extends AbstractRouteBuilder /*implements ApplicationContextAware*/ {

//    private ApplicationContext applicationContext;
    @Autowired
ProxyRouteService proxyService;

    public AWGCamelRouteBuilder() {
    }

    @Override
    public void configure() throws Exception {

        super.configure();

// - moved this to package scan, configured in the xml
//        // demo showing dynamic route creation and destruction
//        this.getContext().addRoutes(new InstallerServiceBuilder());
//
//        // install the doodad service
//        this.getContext().addRoutes(new DoodadRestServiceBuilder());
//
//        // install the proxy management REST service
//        this.getContext().addRoutes(new ProxyRestServiceBuilder());
//

        // populate some example routes
// if not autowired
//        proxyService = (ProxyRouteService)applicationContext.getBean("proxyRoutesService");

        // can also specify initial bean properties in spring xml - but for now, do it like this
        Arrays.asList(
            new ProxyRoute("google", "www.google.com"),
            new ProxyRoute("yahoo", "www.yahoo.com"),
            new ProxyRoute("bbc", "www.bbc.co.uk"),
            new ProxyRoute("msn", "www.msn.com")
        ).forEach(route -> {
            try {
                proxyService.createRoute(route);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        // demo conditional routing on header "endpoint"
        proxyService.createConditionalRoute(
            "api", Arrays.asList(
                new ProxyRoute("endpoint=SERVICE_ONE", "10.3.46.148:8080/api"),
                new ProxyRoute("endpoint=SERVICE_TWO", "10.3.46.148:8081/api")
        ));

    }

// if not using spring annotations
//    @Override
//    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
//        this.applicationContext = applicationContext;
//    }
}
