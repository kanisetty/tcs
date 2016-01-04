package com.opentext.tempo.notifications;


import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class InviteHandlerCtxListener implements ServletContextListener {

    public static final String INVITE_LOG_BREAK =
            "*********************** - TEMPO INVITE HANDLER SERVICE - ***********************";

    public void contextInitialized(ServletContextEvent sce) {
        // do any service setup you need
        logBreak();
        System.out.println("Tempo Invite Handling Service Servlet context has started");
        logBreak();
    }

    public void contextDestroyed(ServletContextEvent sce) {
        // do any  service teardown you need
        logBreak();
        System.out.println("Tempo Invite Handling Service Servlet context destroyed");
        logBreak();
    }

    private void logBreak() {
        System.out.println(INVITE_LOG_BREAK);
    }

}
