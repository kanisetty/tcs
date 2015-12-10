package com.opentext.otsync.rest.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class JsonpFilter implements Filter {

    public static final String JSONP_METHOD_PARAMETER = "_method";
    public static final String JSONP_CALLBACK_PARAMETER = "_callback";

    public static final Log log = LogFactory.getLog(JsonpFilter.class);

    @Override
    public void destroy() {
        // no action needed
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {

        // This is a workaround for a bug caused by Chrome browsers not including a character set in the Content-Type header
        // of a form post. Chrome will post utf-8 if that is what the server sends (and that is our standard), but it
        // will not declare that it is doing so. We have not found a way to override this behaviour in the browser,
        // so we assume a default encoding of utf-8 if none is specified.
        if(req.getCharacterEncoding() == null){
            req.setCharacterEncoding("UTF-8");  //$NON-NLS-1$
        }

        String callback = req.getParameter(JSONP_CALLBACK_PARAMETER);

        if(callback != null && req instanceof HttpServletRequest && resp instanceof HttpServletResponse){
            if(!callback.matches("^[a-zA-Z0-9_]*$")) {
                throw new IOException("Request contains invalid jsonp callback parameter.");
            }

            HttpServletRequest hreq = (HttpServletRequest) req;
            JsonpRequestWrapper requestWrapper;

            String method = req.getParameter(JSONP_METHOD_PARAMETER);
            if("GET".equalsIgnoreCase(method)){
                requestWrapper = new JsonpRequestWrapper(hreq, "GET");
            } else if ("POST".equalsIgnoreCase(method)){
                requestWrapper = new JsonpRequestWrapper(hreq, "POST");
            } else if ("PUT".equalsIgnoreCase(method)){
                requestWrapper = new JsonpRequestWrapper(hreq, "PUT");
            } else if ("DELETE".equalsIgnoreCase(method)){
                requestWrapper = new JsonpRequestWrapper(hreq, "DELETE");
            } else {
                requestWrapper = new JsonpRequestWrapper(hreq, "GET");
            }

            JsonpResponseWrapper responseWrapper = new JsonpResponseWrapper((HttpServletResponse) resp, callback);

            chain.doFilter(requestWrapper, responseWrapper);
            responseWrapper.complete();
        }
        else {
            if(req instanceof HttpServletRequest && "POST".equalsIgnoreCase(((HttpServletRequest)req).getMethod())){
                log.info("A warning about POST requests is expected due to jsonp filtering, and can be safely ignored.");
            }
            chain.doFilter(req, resp);
        }
    }

    @Override
    public void init(FilterConfig config) throws ServletException {
        // no config needed
    }

}

