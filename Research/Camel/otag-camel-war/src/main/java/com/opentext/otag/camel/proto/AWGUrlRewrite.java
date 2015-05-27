package com.opentext.otag.camel.proto;

import org.apache.camel.CamelContext;
import org.apache.camel.Producer;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.http.UrlRewrite;
import org.apache.camel.model.ChoiceDefinition;
import org.apache.camel.model.RouteDefinition;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

/**
 * Created by Pete on 23/05/2015.
 */
public class AWGUrlRewrite implements UrlRewrite {

    @Autowired
    CamelContext camelContext;

    private final Map<String,ProxyRoute> routes = new HashMap<>();

    @Override
    public String rewrite(String url, String relativeUrl, Producer producer) throws Exception {
        ProxyRoute proxyRoute = routes.get(url.substring(20, 56));
        if (proxyRoute == null) {
            throw new NotFoundException();
        }
        return "http://" + proxyRoute.getReplace() + url.substring(56);
    }

    public Collection<ProxyRoute> getRoutes() {
        return routes.values();
    }

    public void createRoute(final ProxyRoute route) throws Exception {
        camelContext.addRoutes(new RouteBuilder() {
            public void configure() throws Exception {

                String id = UUID.randomUUID().toString();
                route.setId(id);

                from("servlet://0.0.0.0:0000/" + route.getMatch() + "?matchOnUriPrefix=true")
                .routeId(id)
                .to("http://0.0.0.0:0000/" + id + "/?bridgeEndpoint=true&throwExceptionOnFailure=false&urlRewrite=#awgUrlRewriteIn");

                routes.put(id, route);
            }
        });
    }


    public void createConditionalRoute(String match, List<ProxyRoute> replaceList) throws Exception {
        camelContext.addRoutes(new RouteBuilder() {
            public void configure() throws Exception {
                ChoiceDefinition choice = from("servlet://0.0.0.0:0000/" + match + "?matchOnUriPrefix=true").choice();
                for (ProxyRoute route : replaceList) {
                    String id = UUID.randomUUID().toString();
                    String[] split = route.getMatch().split("=");
                    choice
                            .when(header(split[0]).isEqualTo(split[1]))
                            .to("http://0.0.0.0:0000/" + id + "/?bridgeEndpoint=true&throwExceptionOnFailure=false&urlRewrite=#awgUrlRewriteIn");
                    // done with header defn now, replace with match to keep url rewriting generic
                    route.setMatch(match);
                    routes.put(id, route);
                }
                choice.otherwise().setHeader("CamelHttpResponseCode", constant(404));
            }
        });
    }
}
