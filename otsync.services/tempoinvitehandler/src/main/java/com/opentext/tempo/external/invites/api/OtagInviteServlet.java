package com.opentext.tempo.external.invites.api;

import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import com.opentext.tempo.external.invites.TempoInviteHandlerService;
import com.opentext.tempo.external.invites.appworks.di.ServiceIndex;
import com.opentext.tempo.external.invites.handler.BrandingStrings;
import com.opentext.tempo.external.invites.handler.Messages;
import com.opentext.tempo.external.invites.handler.TempoInviteHandler;
import com.opentext.tempo.external.invites.handler.XmlPackage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Element;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.parsers.ParserConfigurationException;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Locale;
import java.util.Properties;

public final class OtagInviteServlet extends HttpServlet {

    private static final long serialVersionUID = 7768014454016544509L;

    private static final Logger LOG = LoggerFactory.getLogger(OtagInviteServlet.class);

    /**
     * Used to form the links in emails to direct the user to acceptance form and general invite UI
     * we provide.
     */
    private static final String INVITE_HANDLER_SERVICE_PATH = "/tempoinvitehandler";

    /**
     * The Gateway exposes its public URL (could be a load balancer address).
     */
    private static final String OTAG_URL = "otag.url";

    public OtagInviteServlet() {
        super();
    }

    public void init() throws ServletException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        handleRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        handleRequest(request, response);
    }

    private void handleRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            // load the service ASAP to determine whether we can service the request
            TempoInviteHandler inviteHandler = ServiceIndex.tempoInviteHandler();

            // Locale from the request...
            Locale locale = request.getLocale();
            if (locale == null) {
                locale = Locale.ENGLISH;
            }
            // Language directory to use...
            String langFolder = getLangFolder(locale);

            // Localised messages to use
            Messages messages = new Messages(locale);
            if (!messages.isValid()) {
                messages = new Messages(Locale.ENGLISH);
            }
            if (!messages.isValid()) {
                // Something is really wrong if we could not at least default to the English messages!
                throw new IllegalStateException("Could not load java resource bundle file for locale: " +
                        locale.getLanguage());
            }

            XmlPackage xml = generateXmlPackage(request);
            String pathInfo = request.getPathInfo();
            String servletPath = request.getServletPath();
            if ("/register".equals(servletPath)) {
                setupCommonSetting(xml);

                if ("/success".equals(pathInfo)) {
                    inviteHandler.handleSignonSuccessAction(
                            getServletContext(), request, response, xml, langFolder);
                } else if ("/create".equals(pathInfo)) {
                    inviteHandler.handleCreateUserAction(
                            getServletContext(), request, response, xml, langFolder, messages);
                } else if ("/setupexistinguser".equals(pathInfo)) {
                    inviteHandler.handleSetupExistingUser(
                            getServletContext(), request, response, xml, langFolder, messages);
                } else if ("/validateexistinguser".equals(pathInfo)) {
                    inviteHandler.handleValidateExistingUser(
                            getServletContext(), request, response, xml, langFolder);
                } else if ("/acceptinvitation".equals(pathInfo)) {
                    inviteHandler.handleValidateUserAction(
                            getServletContext(), request, response, xml, langFolder);
                } else if ("/signupexistinguser".equals(pathInfo)) {
                    inviteHandler.handleSignupExistingUser(
                            getServletContext(), response, xml, langFolder);
                } else if ("/forgotpassword".equals(pathInfo)) {
                    inviteHandler.handleForgotPasswordAction(
                            getServletContext(), response, xml, langFolder);
                } else if ("/sendpasswordreset".equals(pathInfo)) {
                    inviteHandler.handleSendPasswordResetAction(
                            getServletContext(), request, response, xml, langFolder);
                } else if ("/validatepwreset".equals(pathInfo)) {
                    inviteHandler.handleValidatePasswordResetAction(
                            getServletContext(), request, response, xml, langFolder);
                } else if ("/passwordreset".equals(pathInfo)) {
                    inviteHandler.handleDoPasswordResetAction(
                            getServletContext(), request, response, xml, langFolder, messages);
                } else if ("/successpwreset".equals(pathInfo)) {
                    inviteHandler.handlePasswordResetSuccessAction(
                            getServletContext(), request, response, xml, langFolder);
                } else {
                    /* ***uncomment these lines to bootstrap the invitation request outside Tempo*** */
                    // if ("/sendinvitation".equals(pathInfo)) {
                    // TempoInviteHandler.handleSendInvitationAction(getServletContext(), "testuser@efsi.com", "John", "Doe");
                    // }
                    throw new IllegalStateException(messages.getString("TempoInviteServlet.InvalidRequest"));
                }
            }
        } catch (ServiceNotReadyException e) {
            throw new WebApplicationException(Response.Status.SERVICE_UNAVAILABLE);
        } catch (Exception e) {
            // TODO FIXME Error handling here
            throw new ServletException(e);
        }
    }

    // TODO this needs to be refactored from something static into something useful
    public static void setupCommonSetting(XmlPackage xml) {
        try {
            Properties properties = readSharedTempoClientProps(
                    System.getProperty("catalina.base") + "/conf/tempo.clients.properties");

            String otagUrl = getOtagUrl();

            String webappUrl = otagUrl + "/webaccess";
            String updatePageUrl = otagUrl + "/content/update.jsp";

            Element settings = xml.addElement(xml.getRoot(), "settings");
            settings.setAttribute("tempowebappurl", webappUrl);
            settings.setAttribute("tempobbappurl", updatePageUrl);
            settings.setAttribute("tempoiosappurl", properties.getProperty("IOSClient"));
            settings.setAttribute("tempopcdesktopurl", updatePageUrl);
            settings.setAttribute("tempoandroidurl", updatePageUrl);
            settings.setAttribute("tempologinurl", updatePageUrl);
            settings.setAttribute("tempourl", otagUrl);
        } catch (Exception ignored) {
        }
    }

    private static Properties readSharedTempoClientProps(String clientsFile) throws IOException {
        Properties properties = new Properties();
        try (FileInputStream fileInput = new FileInputStream(clientsFile)) {
            properties.load(fileInput);
        } catch (Exception e) {
            LOG.warn("Exception encountered loading client properties", e);
        }
        return properties;
    }

    private static XmlPackage generateXmlPackage(String contextPath) throws ParserConfigurationException {
        XmlPackage xml = new XmlPackage();

        xml.getRoot().setAttribute("base", contextPath);
        xml.getRoot().setAttribute("media", contextPath + "/media");
        xml.getRoot().setAttribute("fullbase", getBaseURL());
        xml.getRoot().setAttribute("productName", BrandingStrings.getProductName());
        xml.getRoot().setAttribute("shortProductName", BrandingStrings.getShortProductName());
        xml.getRoot().setAttribute("companyName", BrandingStrings.getCompanyName());

        return xml;
    }

    private XmlPackage generateXmlPackage(HttpServletRequest request) throws ParserConfigurationException {
        return generateXmlPackage(request.getContextPath());
    }

    public static XmlPackage generateXmlPackage(ServletContext servletContext) throws ParserConfigurationException {
        String contextPath = servletContext.getContextPath();
        return generateXmlPackage(contextPath);
    }

    // TODO FIXME - Calling out to OTAG here, we shouldn't do this every time, could be expensive, register settings handler?
    private static String getBaseURL() {
        String serviceBase = getOtagUrl() + INVITE_HANDLER_SERVICE_PATH;
        if (LOG.isDebugEnabled())
            LOG.debug("Resolved handler service base as {}", serviceBase);
        return serviceBase;
    }

    private static String getOtagUrl() {
        return getSettingValue(OTAG_URL);
    }

    private String getLangFolder(Locale locale) {
        String langFolder = "en";
        String language = locale.getLanguage();
        if ("en".equalsIgnoreCase(language)) {
            langFolder = "en";
        } else if ("de".equalsIgnoreCase(language)) {
            langFolder = "de";
        } else if ("es".equalsIgnoreCase(language)) {
            langFolder = "es";
        } else if ("fr".equalsIgnoreCase(language)) {
            langFolder = "fr";
        } else if ("it".equalsIgnoreCase(language)) {
            langFolder = "it";
        } else if ("ja".equalsIgnoreCase(language)) {
            langFolder = "ja";
        } else if ("nl".equalsIgnoreCase(language)) {
            langFolder = "nl";
        } else if ("pt".equalsIgnoreCase(language)) {
            langFolder = "pt-BR";
        } else if ("ru".equalsIgnoreCase(language)) {
            langFolder = "ru";
        } else if ("zh".equalsIgnoreCase(language)) {
            langFolder = "zh-CN";
        }
        return langFolder;
    }

    public static String getSettingValue(String settingKey) {
        TempoInviteHandlerService handlerService = ServiceIndex.tempoInviteHandlerService();
        if (handlerService != null) {
            SettingsClient client = handlerService.getSettingsClient();
            try {
                if (client != null)
                    return client.getSettingAsString(settingKey);
            } catch (APIException e) {
                LOG.error("Failed to get setting {} from Gateway - {}", settingKey ,e.getCallInfo());
            }
        }
        return null;
    }

}

