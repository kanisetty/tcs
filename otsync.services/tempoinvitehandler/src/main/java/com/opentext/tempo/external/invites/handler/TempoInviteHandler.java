package com.opentext.tempo.external.invites.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opentext.otag.service.context.components.AWComponent;
import com.opentext.otsync.api.HttpClient;
import com.opentext.otsync.rest.util.CSForwardHeaders;
import com.opentext.tempo.external.invites.api.OtagInviteServlet;
import com.opentext.tempo.external.invites.appworks.di.ServiceIndex;
import com.opentext.tempo.external.invites.email.ExternalUserEmailClient;
import com.opentext.tempo.external.invites.invitee.managment.CSExternalUserAPI;
import com.opentext.tempo.external.invites.invitee.managment.ExternalUserAPI;
import com.opentext.tempo.external.invites.invitee.managment.ExternalUserAPIResult;
import com.opentext.tempo.external.invites.invitee.managment.OtdsExternalUserAPI;
import com.opentext.tempo.external.invites.persistence.TempoInviteRepository;
import com.opentext.tempo.external.invites.persistence.domain.NewInvitee;
import com.opentext.tempo.external.invites.persistence.domain.PasswordReset;
import org.apache.http.NameValuePair;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.io.StringReader;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import static com.opentext.otag.sdk.util.StringUtil.isNullOrEmpty;

/**
 * Main business logic class in this service,
 */
public final class TempoInviteHandler implements AWComponent {

    private static final Logger LOG = LoggerFactory.getLogger(TempoInviteHandler.class);

    private static final String GET_OTDS_RESOURCEID_FUNC = "otdsintegration.getresourceid";

    private final ExternalUserEmailClient emailClient;
    private final TempoInviteRepository inviteRepository;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    /**
     * User API member, depending on whether Content Server is using OTDS or not
     * the implementation may vary.
     */
    private ExternalUserAPI externalUserAPI;

    private Set<String> availableLanguageFolders = null;

    public TempoInviteHandler(ExternalUserEmailClient emailClient,
                              TempoInviteRepository inviteRepository) {
        this.emailClient = emailClient;
        this.inviteRepository = inviteRepository;

        this.objectMapper = new ObjectMapper();
        this.httpClient = new HttpClient();
    }

    // we don't want AppWorks to create an instance of this service for us
    @Override
    public boolean autoDeploy() {
        return false;
    }

    public ExternalUserAPIResult handleSendInvitationAction(ServletContext servletContext,
                                                            String email,
                                                            String inviterFirstName,
                                                            String inviterLastName,
                                                            String lang,
                                                            String folderName,
                                                            String folderDesc,
                                                            String extraInfo) {

        String inviterName = trimParameterValue(inviterFirstName) + " " + trimParameterValue(inviterLastName);
        ExternalUserAPIResult result = new ExternalUserAPIResult();

        try {
            XmlPackage xml = OtagInviteServlet.generateXmlPackage(servletContext);
            OtagInviteServlet.setupCommonSetting(xml);

            Element invitee = xml.addElement(xml.getRoot(), "invitee");
            invitee.setAttribute("email", email);
            invitee.setAttribute("inviterdisplayname", inviterName);

            if (LOG.isDebugEnabled())
                LOG.debug("Storing new invitee - {} invited {}", inviterName, email);
            String token = inviteRepository.addNewInvitee(email, inviterName);
            invitee.setAttribute("token", token);

            xml.getRoot().setAttribute("foldername", folderName);
            xml.getRoot().setAttribute("folderdesc", folderDesc);
            xml.getRoot().setAttribute("extrainfo", extraInfo);
            if (LOG.isDebugEnabled())
                LOG.debug("Sending invite email to {}", email);
            emailClient.sendInvitationEmail(servletContext, xml, email,
                    getFolderFromLanguageString(lang, servletContext));
        } catch (Exception e) {
            result = new ExternalUserAPIResult(ExternalUserAPIResult.ResultType.IOERROR, e.getMessage());
            LOG.error("Failed to handle send invitation action", e);
        }

        return result;
    }

    private String getFolderFromLanguageString(String lang, ServletContext context) {
        // If we can't find an appropriate language folder, default to English
        String folder = "en";

        if (lang == null)
            return folder;

        if (availableLanguageFolders == null) {
            initializeLanguageFolders(context);
        }

        if (availableLanguageFolders.contains(lang)) {
            folder = lang;
        } else {
            // get the string before the first dash, e.g. "en-US" ==> "en"
            int indexOfHyphen = lang.indexOf('-');
            if (indexOfHyphen >= 0) {
                String trimmedLang = lang.substring(0, indexOfHyphen);
                if (availableLanguageFolders.contains(trimmedLang)) {
                    folder = trimmedLang;
                }
            }
        }

        return folder;
    }

    private void initializeLanguageFolders(ServletContext context) {
        Set<String> folders = new HashSet<>();

        // Get a list of all resources in the xsl directory, then remember the names
        // of those ending in "/", which are the sub-directories. The directory is
        // structured such that there is one of these for each available language.-
        Set<String> resources = context.getResourcePaths("/WEB-INF/xsl/");

        if (resources != null) {
            resources.stream()
                    .filter(path -> path.endsWith("/"))
                    .forEach(path -> {
                        File abstractPath = new File(path);
                        folders.add(abstractPath.getName());
                    });
        }

        availableLanguageFolders = folders;
    }

    public void handleSignonSuccessAction(ServletContext servletContext,
                                          HttpServletRequest request,
                                          HttpServletResponse response,
                                          XmlPackage xml,
                                          String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        String invitationToken = request.getParameter("invitationtoken");
        NewInvitee newuser = inviteRepository.loadInviteeFromToken(invitationToken);

        Element user = xml.addElement(xml.getRoot(), "user");
        user.setAttribute("showstep", request.getParameter("showstep"));
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
    public void handleCreateUserAction(ServletContext servletContext,
                                       HttpServletRequest request,
                                       HttpServletResponse response,
                                       XmlPackage xml,
                                       String langFolder,
                                       Messages messages) throws Exception {
        Element user = xml.addElement(xml.getRoot(), "user");

        if (request.getCharacterEncoding() == null)
            request.setCharacterEncoding("UTF-8");

        String invitationtoken = request.getParameter("invitationtoken");
        NewInvitee newuser = inviteRepository.loadInviteeFromToken(invitationtoken);

        if (invitationtoken == null)
            throw new WebApplicationException(Response.Status.BAD_REQUEST);

        user.setAttribute("showstep", "none");

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

        if (isNullOrEmpty(firstname) || isNullOrEmpty(lastname)) {
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

            inviteRepository.validateInvitee(invitationtoken, firstname, lastname);
            emailClient.sendSuccessEmail(servletContext, xml, newuser.getEmail(), langFolder);
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
    public void handleValidateUserAction(ServletContext servletContext,
                                         HttpServletRequest request,
                                         HttpServletResponse response,
                                         XmlPackage xml,
                                         String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {

        String invitationtoken = request.getParameter("invitationtoken");
        NewInvitee invitee = inviteRepository.loadInviteeFromToken(invitationtoken);

        Element user = xml.addElement(xml.getRoot(), "user");

        if (invitee.getValidationDate() != null) {
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
    public void handleValidateExistingUser(ServletContext servletContext,
                                           HttpServletRequest request,
                                           HttpServletResponse response,
                                           XmlPackage xml,
                                           String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        String invitationtoken = request.getParameter("invitationtoken");
        NewInvitee newuser = inviteRepository.loadInviteeFromToken(invitationtoken);

        Element user = xml.addElement(xml.getRoot(), "user");

        populateUserElement(newuser, user);
        user.setAttribute("invitationtoken", invitationtoken);
        user.setAttribute("showstep", "none");

        generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl");
    }

    public void handleSignupExistingUser(ServletContext servletContext,
                                         HttpServletResponse response,
                                         XmlPackage xml,
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
    public void handleSetupExistingUser(ServletContext servletContext,
                                        HttpServletRequest request,
                                        HttpServletResponse response,
                                        XmlPackage xml,
                                        String langFolder,
                                        Messages messages) throws Exception {
        Element user = xml.addElement(xml.getRoot(), "user");
        String invitationToken = request.getParameter("invitationtoken");

        user.setAttribute("invitationtoken", invitationToken);
        user.setAttribute("showstep", "none");

        String username = trimParameterValue(request.getParameter("username"));
        user.setAttribute("username", username);

        String password = trimParameterValue(request.getParameter("password"));
        user.setAttribute("password", password);

        if (isNullOrEmpty(username) || isNullOrEmpty(password)) {
            user.setAttribute("user_error", "true");
            generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl");
        } else {
            NewInvitee invitee = inviteRepository.loadInviteeFromToken(invitationToken);

            ExternalUserAPIResult result = getExternalUserAPI()
                    .inviteeValidated(invitee.getEmail(), username, password, new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(result.errMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/signupexistinguser.xsl");
                return;
            }

            inviteRepository.validateInvitee(invitationToken, "", "");
            emailClient.sendSuccessEmail(servletContext, xml, username, langFolder);
            String showStepParam = "none";
            redirect(response, request.getContextPath() + "/register/success?invitationtoken=" +
                    invitationToken + "&showstep=" + showStepParam);
        }
    }

    public void handleForgotPasswordAction(ServletContext servletContext,
                                           HttpServletResponse response,
                                           XmlPackage xml,
                                           String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        Element user = xml.addElement(xml.getRoot(), "user");
        user.setAttribute("showstep", "one");
        generateHTMLOutput(servletContext, response, xml, langFolder + "/forgotpassword.xsl");
    }

    public void handleSendPasswordResetAction(ServletContext servletContext,
                                              HttpServletRequest request,
                                              HttpServletResponse response,
                                              XmlPackage xml,
                                              String langFolder) throws Exception {
        String username = trimParameterValue(request.getParameter("username"));

        Element user = xml.addElement(xml.getRoot(), "user");
        user.setAttribute("username", username);

        boolean isBadUsernameError = false;
        boolean isUserError = false;

        if (isNullOrEmpty(username)) {
            isUserError = true;
        }

        if (!isUserError) {
            ExternalUserAPIResult result = getExternalUserAPI()
                    .userExist(username, new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                isBadUsernameError = true;
            }
        }

        if (isUserError) {
            user.setAttribute("user_error", "true");
            generateHTMLOutput(servletContext, response, xml, langFolder + "/forgotpassword.xsl");
        } else {
            user.setAttribute("email", username);
            if (!isBadUsernameError) {
                // We have good form values. Enter them into the DB and send e-mail(s).
                String token = inviteRepository.addPasswordReset(username);
                user.setAttribute("token", token);
                emailClient.sendPasswordResetEmail(servletContext, xml, username, langFolder);
            }
            // we show the email sent page regardless of whether the username was valid, so
            // no-one can fish for existing e-mails
            generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetmailsent.xsl");
        }
    }

    public void handleValidatePasswordResetAction(ServletContext servletContext,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response,
                                                  XmlPackage xml,
                                                  String langFolder)
            throws ClassNotFoundException, SQLException, IOException, TransformerException {
        String token = request.getParameter("token");
        PasswordReset pwReset = inviteRepository.loadPasswordResetFromToken(token);

        Element user = xml.addElement(xml.getRoot(), "user");
        user.setAttribute("token", token);
        user.setAttribute("showstep", "two");

        user.setAttribute("username", pwReset.getUsername());
        if (pwReset.getValidationDate() != null) {
            user.setAttribute("token_already_used", "true");
        }

        generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl");
    }

    public void handleDoPasswordResetAction(ServletContext servletContext,
                                            HttpServletRequest request,
                                            HttpServletResponse response,
                                            XmlPackage xml,
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

        boolean isPasswordConfirmError = false, isUserError = false;

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
            PasswordReset pwReset = inviteRepository.loadPasswordResetFromToken(token);
            user.setAttribute("username", pwReset.getUsername());

            if (pwReset.getValidationDate() != null) {
                user.setAttribute("token_already_used", "true");
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl");
                return;
            }

            String notFoundMsg = messages.getString(
                    "TempoInviteHandler.ExternalUserNotFound", pwReset.getUsername());
            ExternalUserAPIResult result = getExternalUserAPI().userExist(pwReset.getUsername(),
                    new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(notFoundMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl");
                return;
            }

            result = getExternalUserAPI().sendPasswordUpdate(pwReset.getUsername(), null, password,
                    new CSForwardHeaders(request));
            if (result.status != ExternalUserAPIResult.ResultType.SUCCESS) {
                captureExceptionMessage(notFoundMsg, user, messages);
                generateHTMLOutput(servletContext, response, xml, langFolder + "/passwordresetvalidation.xsl");
            } else {
                inviteRepository.validatePasswordReset(token);
                redirect(response, request.getContextPath() + "/register/successpwreset?token=" + token + "&showstep=two");
            }
        }
    }

    public void handlePasswordResetSuccessAction(ServletContext servletContext,
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

    private void generateHTMLOutput(ServletContext servletContext,
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

    private void redirect(HttpServletResponse response, String location) {
        response.setStatus(302);
        response.setHeader("location", location);
    }

    private String trimParameterValue(String value) {
        if (value == null) {
            return null;
        }
        return value.trim();
    }

    private void populateUserElement(NewInvitee newinvitee, Element userElement) {
        userElement.setAttribute("firstname", newinvitee.getFirstName());
        userElement.setAttribute("lastname", newinvitee.getLastname());
        userElement.setAttribute("email", newinvitee.getEmail());
        userElement.setAttribute("username", newinvitee.getEmail());
        userElement.setAttribute("invitername", newinvitee.getInviterName());
    }

    private void captureExceptionMessage(String errMsg, Element userElement, Messages messages) {
        userElement.setAttribute("webservice_error", "true");
        if (errMsg != null) {
            userElement.setAttribute("webservice_error_message", errMsg);
        } else {
            userElement.setAttribute("webservice_error_message", messages.getString("TempoInviteHandler.InternalError"));
        }
    }

    private ExternalUserAPI getExternalUserAPI() {
        if (externalUserAPI != null)
            return externalUserAPI;

        // CS will return the OTDS resource id if it has been configured to use OTDS based auth
        if (isCsUsingOtds()) {
            LOG.info("Using OTDS External User API");
            externalUserAPI = new OtdsExternalUserAPI();
        } else {
            LOG.info("Using CS External User API");
            externalUserAPI = new CSExternalUserAPI(new DefaultHttpClient());
        }

        return externalUserAPI;
    }

    private boolean isCsUsingOtds() {
        String csUrl = ServiceIndex.csUrl();

        if (csUrl != null && !isNullOrEmpty(csUrl)) {
            ArrayList<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("func", GET_OTDS_RESOURCEID_FUNC));
            try {
                String json = httpClient.get(csUrl, params);
                if (!isNullOrEmpty(json)) {
                    JsonNode node = objectMapper.readTree(new StringReader(json));
                    String resourceId = node.get("ResourceID").asText();

                    return !isNullOrEmpty(resourceId);
                }
            } catch (Exception e) {
                LOG.error("Cannot determine CS resource id via func otdsintegration.getresourceid, " +
                        "unable to determine whether CS was using OTDS or not", e);
            }
        } else {
            LOG.warn("CS URL was not available yet");
        }

        return false;
    }

}

