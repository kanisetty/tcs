package com.opentext.tempo.notifications;

import org.apache.http.impl.client.DefaultHttpClient;
import com.opentext.otag.auth.IdentityService;
import com.opentext.otag.auth.IdentityProvider;
import com.opentext.otag.auth.OtdsIdentityService;
import com.opentext.otag.auth.CSIdentityService;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.tempo.notifications.api.auth.CSExternalUserAPI;
import com.opentext.tempo.notifications.api.auth.ExternalUserAPI;
import com.opentext.tempo.notifications.api.auth.ExternalUserAPIResult;
import com.opentext.tempo.notifications.api.auth.OtdsExternalUserAPI;
import com.opentext.tempo.notifications.persistence.TempoInviteRepository;
import com.opentext.tempo.notifications.persistence.domain.NewInvitee;
import com.opentext.tempo.notifications.persistence.domain.PasswordReset;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Element;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.transform.TransformerException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

public final class TempoInviteHandler {
    
    public static final Log log = LogFactory.getLog(TempoInviteHandler.class);

    private static ExternalUserAPI externalUserAPI;

    public static ExternalUserAPIResult handleSendInvitationAction(ServletContext servletContext,
                                                                         String email, 
																		 String inviterFirstName,
                                                                         String inviterLastName,
                                                                         String lang,
                                                                         String folderName,
                                                                         String folderDesc,
																		 String extraInfo) {

        String invitername = trimParameterValue(inviterFirstName) + " " + trimParameterValue(inviterLastName); 
        ExternalUserAPIResult result = new ExternalUserAPIResult();

        try {
            XmlPackage xml = OtagInviteServlet.generateXmlPackage(servletContext);
            OtagInviteServlet.setupCommonSetting(xml);

            TempoInviteRepository db = new TempoInviteRepository();

            Element invitee = xml.addElement(xml.getRoot(), "invitee"); 
            invitee.setAttribute("email", email); 
            invitee.setAttribute("inviterdisplayname", invitername); 

            String token = db.addNewInvitee(email, invitername);
            invitee.setAttribute("token", token); 
			
			xml.getRoot().setAttribute("foldername", folderName); 
			xml.getRoot().setAttribute("folderdesc", folderDesc); 
			xml.getRoot().setAttribute("extrainfo", extraInfo); 
			
            ExternalUserEmailClient mail = new ExternalUserEmailClient();
            mail.sendInvitationEmail(servletContext, xml, email, getFolderFromLanguageString(lang, servletContext));
        } catch (Exception e) {
            result = new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.IOERROR, e.getMessage());
            log.error(e);
        }

        return result;
    }

    static Set<String> availableLanguageFolders = null;

    private static String getFolderFromLanguageString(String lang, ServletContext context) {
        // If we can't find an appropriate language folder, default to English
        String folder = "en"; 

        if (lang == null)
            return folder;

        if (availableLanguageFolders == null){
            initializeLanguageFolders(context);
        }

        if (availableLanguageFolders.contains(lang)){
            folder = lang;
        } else {
            // get the string before the first dash, e.g. "en-US" ==> "en"
            int indexOfHyphen = lang.indexOf('-');
            if(indexOfHyphen >= 0){
                String trimmedLang = lang.substring(0, indexOfHyphen);
                if (availableLanguageFolders.contains(trimmedLang)){
                    folder = trimmedLang;
                }
            }
        }

        return folder;
    }

    private static void initializeLanguageFolders(ServletContext context) {
        Set<String> folders = new HashSet<String>();

        // Get a list of all resources in the xsl directory, then remember the names
        // of those ending in "/", which are the sub-directories. The directory is
        // structured such that there is one of these for each available language.-
        Set<String> resources = context.getResourcePaths("/WEB-INF/xsl/"); 

        if(resources != null){
            for(String path : resources){
                if(path.endsWith("/")){
                    File abstractPath = new File(path);
                    folders.add(abstractPath.getName());
                }
            }
        }

        availableLanguageFolders = folders;
    }

    public static void handleSignonSuccessAction(ServletContext servletContext,
                                                 HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 XmlPackage xml,
                                                 TempoInviteRepository db,
                                                 String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        String invitationtoken = request.getParameter("invitationtoken"); 
        user.setAttribute("showstep", request.getParameter("showstep"));  

        NewInvitee newuser = db.loadInviteeFromToken(invitationtoken);
        populateUserElement(newuser, user);

        generateHTMLOutput(servletContext, response, xml, langFolder + "/signupsuccess.xsl"); 
    }

    /**
     * Handles the request from the user pressing the create account button on the
     * signup validation form. User is clicking on a link in an email they received 
     * when they were invited to join. A valid token should exist representing the data for
     * the user (name, email, etc).
     * </p><p>
     * This handler will make sure the username and password entered are valid.
     * </p>
     */
    public static void handleCreateUserAction(ServletContext servletContext,
                                              HttpServletRequest request,
                                              HttpServletResponse response,
                                              XmlPackage xml,
                                              TempoInviteRepository db,
                                              String langFolder,
                                              Messages messages) throws Exception {
        Element user = xml.addElement(xml.getRoot(), "user"); 

        if (request.getCharacterEncoding() == null)
            request.setCharacterEncoding("UTF-8");

        String invitationtoken = request.getParameter("invitationtoken"); 

        if (invitationtoken == null)
            throw new WebApplicationException(Response.Status.BAD_REQUEST);

        user.setAttribute("showstep", "none");  

        NewInvitee newuser = db.loadInviteeFromToken(invitationtoken);
        populateUserElement(newuser, user);
        user.setAttribute("invitationtoken", invitationtoken); 

        String username = newuser.getEmail();
        user.setAttribute("username", username); 

        String password = trimParameterValue(request.getParameter("password")); 
        user.setAttribute("password", password); 

        String password_confirm = trimParameterValue(request.getParameter("password_confirm")); 
        user.setAttribute("password_confirm", password_confirm); 

        String firstname = trimParameterValue(request.getParameter("firstname")
                .replace("<", "&lt;")
                .replace(">", "&gt;")); 
        user.setAttribute("firstname", firstname); 

        String lastname = trimParameterValue(request.getParameter("lastname")
                .replace("<", "&lt;")
                .replace(">", "&gt;"));
        user.setAttribute("lastname", lastname); 

        boolean isPasswordConfirmError = false, isNameMissingError = false;

        if (!password.equals(password_confirm)) {
            isPasswordConfirmError = true;
        }

        if (firstname.isEmpty() || lastname.isEmpty()) {
            isNameMissingError = true;
        }

        if (isNameMissingError || isPasswordConfirmError) {
            if (isNameMissingError) {
                user.setAttribute("user_error", "true");  
            }
            if (isPasswordConfirmError) {
                user.setAttribute("password_confirm_error", "true");  
            }
            generateHTMLOutput(servletContext, response, xml, langFolder + "/signupvalidation.xsl"); 
        } else {
            ExternalUserAPIResult result = getExternalUserAPI()
                    .inviteeValidated(newuser.getEmail(), password, firstname, lastname, new CSForwardHeaders(request));

            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(result.errMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/signupvalidation.xsl"); 
                return;
            }

            db.validateInvitee(invitationtoken, firstname, lastname);
            ExternalUserEmailClient mail = new ExternalUserEmailClient();
            mail.sendSuccessEmail(servletContext, xml, newuser.getEmail(), langFolder);
            String showStepParam = "none"; 
            redirect(response, request.getContextPath() + "/register/success?invitationtoken=" +
                    invitationtoken + "&showstep=" + showStepParam);
        }
    }

    /**
     * Handles the request from a user clicking a validation link received in an
     * email. Here the user will be allowed to enter a password, first & last name.
     * Called from a user who received an invitation email to join. In that case, 
     * only the invitation token is passed in representing the invite information 
     * collected.
     */
    public static void handleValidateUserAction(ServletContext servletContext,
                                                 HttpServletRequest request, 
                                                 HttpServletResponse response, 
                                                 XmlPackage xml, 
                                                 TempoInviteRepository db,
                                                 String langFolder) 
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        
        Element user = xml.addElement(xml.getRoot(), "user"); 
        String invitationtoken = request.getParameter("invitationtoken"); 

        NewInvitee invitee = db.loadInviteeFromToken(invitationtoken);

        if (invitee.getValidationdate() != null) {
            // Invitee is clicking on the link a second time after having registered already
            user.setAttribute("username", invitee.getEmail());
            user.setAttribute("token_already_used", "true");  
        }

        user.setAttribute("invitationtoken", invitationtoken); 
        user.setAttribute("showstep", "none");  

        populateUserElement(invitee, user);
        generateHTMLOutput(servletContext, response, xml, langFolder + "/signupvalidation.xsl"); 
    }

    /**
     * Handles the request from a validation form where the user wants to reuse an
     * existing username/password instead of creating a new one. User can only get
     * here by clicking a link on the signup validation web page.
     */
    public static void handleValidateExistingUser(ServletContext servletContext,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response,
                                                        XmlPackage xml,
                                                        TempoInviteRepository db,
                                                        String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        String invitationtoken = request.getParameter("invitationtoken"); 

        NewInvitee newuser = db.loadInviteeFromToken(invitationtoken);

        populateUserElement(newuser, user);
        user.setAttribute("invitationtoken", invitationtoken); 
        user.setAttribute("showstep", "none");  

        generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl"); 
    }

    public static void handleSignupExistingUser(ServletContext servletContext,
                                                      HttpServletRequest request,
                                                      HttpServletResponse response,
                                                      XmlPackage xml,
                                                      TempoInviteRepository db,
                                                      String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        user.setAttribute("showstep", "two");  
        user.setAttribute("domain_prefix_force_show", "true");  
        generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl"); 
    }

    /**
     * Handles the request from the user pressing the setup account button on the
     * setup existing user form.
     */
    public static void handleSetupExistingUser(ServletContext servletContext,
                                                     HttpServletRequest request,
                                                     HttpServletResponse response,
                                                     XmlPackage xml,
                                                     TempoInviteRepository db,
                                                     String langFolder,
                                                     Messages messages) throws Exception {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        String invitationtoken = request.getParameter("invitationtoken"); 

        user.setAttribute("invitationtoken", invitationtoken); 
        user.setAttribute("showstep", "none");  

        String username = trimParameterValue(request.getParameter("username")); 
        user.setAttribute("username", username); 

        String password = trimParameterValue(request.getParameter("password")); 
        user.setAttribute("password", password); 

        if (username.isEmpty() || password.isEmpty()) {
            user.setAttribute("user_error", "true");  
            generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl"); 
        } else {
            NewInvitee invitee = db.loadInviteeFromToken(invitationtoken);

            ExternalUserAPIResult result = getExternalUserAPI()
                    .inviteeValidated(invitee.getEmail(), username, password, new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(result.errMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl"); 
                return;
            }

            db.validateInvitee(invitationtoken, "", "");  
            ExternalUserEmailClient mail = new ExternalUserEmailClient();
            mail.sendSuccessEmail(servletContext, xml, username, langFolder);
            String showStepParam = "none"; 
            redirect(response, request.getContextPath() + "/register/success?invitationtoken=" +
                    invitationtoken + "&showstep=" + showStepParam);
        }
    }

    public static void handleForgotPasswordAction(ServletContext servletContext,
                                                  HttpServletResponse response,
                                                  XmlPackage xml,
                                                  String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        user.setAttribute("showstep", "one");  
        generateHTMLOutput(servletContext, response, xml, langFolder + "/forgotpassword.xsl"); 
    }

    public static void handleSendPasswordResetAction(ServletContext servletContext,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response,
                                                           XmlPackage xml,
                                                           TempoInviteRepository db,
                                                           String langFolder) throws Exception {
        String username = trimParameterValue(request.getParameter("username")); 

        Element user = xml.addElement(xml.getRoot(), "user"); 
        user.setAttribute("username", username); 

        boolean isBadUsernameError = false;
        boolean isUserError = false;

        if (username.isEmpty()) {
            isUserError = true;
        }

        if (!isUserError) {
            ExternalUserAPIResult result = getExternalUserAPI()
                    .userExist(username, new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                isBadUsernameError = true;
            }
        }

        if (isUserError ) {
            user.setAttribute("user_error", "true");
            generateHTMLOutput(servletContext, response, xml, langFolder + "/forgotpassword.xsl");
        } else {
            user.setAttribute("email", username); 
            if (!isBadUsernameError){
                // We have good form values. Enter them into the DB and send e-mail(s).
                String token = db.addPasswordReset(username);
                user.setAttribute("token", token); 
                ExternalUserEmailClient mail = new ExternalUserEmailClient();
                mail.sendPasswordResetEmail(servletContext, xml, username, langFolder);
            }
            // we show the email sent page regardless of whether the username was valid, so
            // no-one can fish for existing e-mails
            generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetmailsent.xsl"); 
        }
    }

    public static void handleValidatePasswordResetAction(ServletContext servletContext,
                                                               HttpServletRequest request,
                                                               HttpServletResponse response,
                                                               XmlPackage xml,
                                                               TempoInviteRepository db,
                                                               String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user");
        String token = request.getParameter("token"); 

        user.setAttribute("token", token); 
        user.setAttribute("showstep", "two");  

        PasswordReset pwReset = db.loadPasswordResetFromToken(token);
        user.setAttribute("username", pwReset.getUsername());
        if (pwReset.getValidationdate() != null) {
            user.setAttribute("token_already_used", "true");  
        }

        generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl"); 
    }

    public static void handleDoPasswordResetAction(ServletContext servletContext,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response,
                                                         XmlPackage xml,
                                                         TempoInviteRepository db,
                                                         String langFolder,
                                                         Messages messages) throws Exception {
        Element user = xml.addElement(xml.getRoot(), "user"); 
        String token = request.getParameter("token"); 

        user.setAttribute("token", token); 
        user.setAttribute("showstep", "two");  

        String password = trimParameterValue(request.getParameter("password")); 
        user.setAttribute("password", password); 

        String password_confirm = trimParameterValue(request.getParameter("password_confirm")); 
        user.setAttribute("password_confirm", password_confirm); 

        boolean isPasswordConfirmError = false, isUserError=false;

        if (password.length() == 0) {
            isUserError = true;
        }
        if (!password.equals(password_confirm)) {
            isPasswordConfirmError = true;
        }

        if (isPasswordConfirmError || isUserError) {
            if (isPasswordConfirmError) {
                user.setAttribute("password_confirm_error", "true");  
            }
            if (isUserError) {
                user.setAttribute("user_error", "true");  
            }
            generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl"); 
        } else {
            PasswordReset pwReset = db.loadPasswordResetFromToken(token);
            user.setAttribute("username", pwReset.getUsername());

            if (pwReset.getValidationdate() != null) {
                user.setAttribute("token_already_used", "true");  
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl"); 
                return;
            }

            String notFoundMsg = messages.getString("TempoInviteHandler.ExternalUserNotFound", pwReset.getUsername());
            ExternalUserAPIResult result = getExternalUserAPI().userExist(pwReset.getUsername(), new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(notFoundMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl"); 
                return;
            }

            result = getExternalUserAPI().sendPasswordUpdate(pwReset.getUsername(), null, password, new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(notFoundMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl"); 
            } else {
                db.validatePasswordReset(token);
                redirect(response, request.getContextPath() + "/register/successpwreset?token=" + token + "&showstep=two");  
            }
        }
    }

    public static void handlePasswordResetSuccessAction(ServletContext servletContext,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response,
                                                        XmlPackage xml,
                                                        String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {

        Element user = xml.addElement(xml.getRoot(), "user"); 
        String token = request.getParameter("token"); 
        user.setAttribute("token", token); 
        user.setAttribute("showstep", request.getParameter("showstep"));  

        generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetsuccess.xsl"); 
    }

    public static void generateHTMLOutput(ServletContext servletContext,
                                                HttpServletResponse response,
                                                XmlPackage xml,
                                                String xslpath) throws IOException, TransformerException {
        InputStream xsl = servletContext.getResourceAsStream("/WEB-INF/xsl/" + xslpath); 
        String xslPath = servletContext.getRealPath("/WEB-INF/xsl/" + xslpath); 
        response.setContentType("text/html; charset=UTF-8"); 
        response.setCharacterEncoding("UTF-8"); 
        xml.write(response.getWriter(), xslPath, xsl);
        xsl.close();
    }

    private static void redirect(HttpServletResponse response, String location) {
        response.setStatus(302);
        response.setHeader("location", location); 
    }

    private static String trimParameterValue(String value) {
        if (value == null) {
            return null;
        }
        return value.trim();
    }

    private static void populateUserElement(NewInvitee newinvitee, Element userElement) {
        userElement.setAttribute("firstname", newinvitee.getFirstname());
        userElement.setAttribute("lastname", newinvitee.getLastname());
        userElement.setAttribute("email", newinvitee.getEmail());
        userElement.setAttribute("username", newinvitee.getEmail());
        userElement.setAttribute("invitername", newinvitee.getInvitername());
    }

    private static void captureExceptionMessage(String errMsg, Element userElement, Messages messages) {
        userElement.setAttribute("webservice_error", "true");  
        if (errMsg != null) {
            userElement.setAttribute("webservice_error_message", errMsg); 
        } else {
            userElement.setAttribute("webservice_error_message", messages.getString("TempoInviteHandler.InternalError"));  
        }
    }

    private static ExternalUserAPI getExternalUserAPI() {
        if (externalUserAPI != null)
            return externalUserAPI;

        // the IdentityServiceProvider determines the implementation the Gateway is currently using
        // so we build our external auth API handler accordingly
        IdentityService service = IdentityProvider.getService();

        if (service instanceof OtdsIdentityService) {
            OtdsIdentityService otdsIdentityService = (OtdsIdentityService) service;
            externalUserAPI = new OtdsExternalUserAPI(otdsIdentityService);
        }

        if (service instanceof CSIdentityService)
            externalUserAPI = new CSExternalUserAPI(new DefaultHttpClient());

        if (externalUserAPI == null)
            throw new RuntimeException("Unable to resolve the IdentityService type that the " +
                    "Gateway is using");

        return externalUserAPI;
    }

}

