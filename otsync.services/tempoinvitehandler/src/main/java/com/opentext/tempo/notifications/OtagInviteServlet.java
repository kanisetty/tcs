package com.opentext.tempo.notifications;

import com.opentext.otag.api.shared.types.sdk.AppworksComponentContext;
import com.opentext.otag.sdk.client.SettingsClient;
import com.opentext.tempo.notifications.persistence.TempoInviteRepository;
import org.w3c.dom.Element;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.ParserConfigurationException;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Locale;
import java.util.Properties;

public final class OtagInviteServlet extends HttpServlet {

    private static final long serialVersionUID = 7768014454016544509L;

    /**
     * Used to form the links in emails to direct the user to acceptance form and general invite UI
     * we provide.
     */
    public static final String INVITE_HANDLER_SERVICE_PATH = "/tempoinvitehandler";
    public static final String OTAG_URL = "otag.url";

    public OtagInviteServlet() {
        super();
    }

    public void init() throws ServletException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleRequest(request, response);
    }

    private void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
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
                throw new IllegalStateException("Could not load java resource bundle file for locale: " + locale.getLanguage()); 
            }

            XmlPackage xml = generateXmlPackage(request);
            String pathInfo = request.getPathInfo();
            String servletPath = request.getServletPath();
            if ("/register".equals(servletPath)) { 
                TempoInviteRepository db = new TempoInviteRepository();
                setupCommonSetting(xml);

                if ("/success".equals(pathInfo)) { 
                    TempoInviteHandler.handleSignonSuccessAction(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/create".equals(pathInfo)) { 
                    TempoInviteHandler.handleCreateUserAction(getServletContext(), request, response, xml, db, langFolder, messages);
                } else if ("/setupexistinguser".equals(pathInfo)) { 
                    TempoInviteHandler.handleSetupExistingUser(getServletContext(), request, response, xml, db, langFolder, messages);
                } else if ("/validateexistinguser".equals(pathInfo)) { 
                    TempoInviteHandler.handleValidateExistingUser(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/acceptinvitation".equals(pathInfo)) { 
                    TempoInviteHandler.handleValidateUserAction(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/signupexistinguser".equals(pathInfo)) { 
                    TempoInviteHandler.handleSignupExistingUser(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/forgotpassword".equals(pathInfo)) { 
                    TempoInviteHandler.handleForgotPasswordAction(getServletContext(), response, xml, langFolder);
                } else if ("/sendpasswordreset".equals(pathInfo)) { 
                    TempoInviteHandler.handleSendPasswordResetAction(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/validatepwreset".equals(pathInfo)) { 
                    TempoInviteHandler.handleValidatePasswordResetAction(getServletContext(), request, response, xml, db, langFolder);
                } else if ("/passwordreset".equals(pathInfo)) { 
                    TempoInviteHandler.handleDoPasswordResetAction(getServletContext(), request, response, xml, db, langFolder, messages);
                } else if ("/successpwreset".equals(pathInfo)) { 
                    TempoInviteHandler.handlePasswordResetSuccessAction(getServletContext(), request, response, xml, langFolder);
                } else {
					/* ***uncomment these lines to bootstrap the invitation request outside Tempo*** */
                    // if ("/sendinvitation".equals(pathInfo)) {
                    // TempoInviteHandler.handleSendInvitationAction(getServletContext(), "testuser@efsi.com", "John", "Doe");
                    // }
                    throw new IllegalStateException(messages.getString("TempoInviteServlet.InvalidRequest")); 
                }
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    public static void setupCommonSetting(XmlPackage xml) {
        try {
            Properties properties = readClientsProperties(System.getProperty("catalina.base") + "/conf/tempo.clients.properties");  

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

    private static Properties readClientsProperties(String clientsFile) throws IOException {
        Properties properties = new Properties();

        FileInputStream fileInput = null;
        try {
            fileInput = new FileInputStream(clientsFile);
            properties.load(fileInput);
        } finally {
            if (fileInput != null) {
                try {
                    fileInput.close();
                } catch (IOException e) {
                    // do nothing
                }
            }
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

    // TODO FIXME - You NEED to make the name of this service match the INIVITE_HANDLER_SERVICE_PATH or this wont work!
    private static String getBaseURL() {
        return getOtagUrl() + INVITE_HANDLER_SERVICE_PATH;
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

    private static String getSettingValue(String settingKey) {
        TempoNotificationsService notificationService =
                AppworksComponentContext.getComponent(TempoNotificationsService.class);
        if (notificationService != null) {
            SettingsClient client = notificationService.getSettingsClient();
            if (client != null)
                return client.getSettingAsString(settingKey);
        }

        return null;
    }

}

