package com.opentext.tempo.notifications;

import com.opentext.otag.sdk.client.v3.MailClient;
import com.opentext.otag.sdk.client.v3.SettingsClient;
import com.opentext.otag.sdk.types.v3.MailRequest;
import com.opentext.otag.sdk.types.v3.api.error.APIException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.mail.MessagingException;
import javax.servlet.ServletContext;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Collections;

public class ExternalUserEmailClient {

    public static final Log log = LogFactory.getLog(ExternalUserEmailClient.class);

    private final MailClient mailClient = new MailClient();

    public static final String OTAG_SMTP_FROM = "otag.smtp.from";

    public void sendSuccessEmail(ServletContext context, XmlPackage xml, String email, String langFolder)
            throws IOException, TransformerException, MessagingException {

        sendContextEmail(context, langFolder + "/successemail-subject.xsl",
                langFolder + "/successemail.xsl", xml, email);
    }

    public void sendInvitationEmail(ServletContext context, XmlPackage xml, String email, String langFolder)
            throws IOException, TransformerException, MessagingException {

        sendContextEmail(context, langFolder + "/invitationemail-subject.xsl",
                langFolder + "/invitationemail.xsl", xml, email);
    }

    public void sendPasswordResetEmail(ServletContext context, XmlPackage xml, String email, String langFolder)
            throws IOException, TransformerException, MessagingException {

        sendContextEmail(context, langFolder + "/passwordresetemail-subject.xsl",
                langFolder + "/passwordresetemail.xsl", xml, email);
    }

    protected void sendContextEmail(ServletContext context, String subjectxsl, String bodyxsl,
                                    XmlPackage xml, String email)
            throws IOException, TransformerException, MessagingException {
        InputStream xslSubject = context.getResourceAsStream("/WEB-INF/xsl/" + subjectxsl);
        String xslSubjectPath = context.getRealPath("/WEB-INF/xsl/" + subjectxsl);

        InputStream xslBody = context.getResourceAsStream("/WEB-INF/xsl/" + bodyxsl);
        String xslBodyPath = context.getRealPath("/WEB-INF/xsl/" + bodyxsl);

        StringWriter subjectStringWriter = new StringWriter();
        StringWriter bodyStringWriter = new StringWriter();

        xml.write(subjectStringWriter, xslSubjectPath, xslSubject);
        xml.write(bodyStringWriter, xslBodyPath, xslBody);

        try {
            SettingsClient settingsClient = new SettingsClient();
            String mailFromSetting = settingsClient.getSettingAsString(OTAG_SMTP_FROM);
            if (mailFromSetting != null) {
                MailRequest mailRequest = new MailRequest(mailFromSetting, Collections.singletonList(email),
                        subjectStringWriter.toString(), bodyStringWriter.toString());
                mailClient.sendMail(mailRequest);
            } else {
                log.warn("Failed to get the Gateway's \"from\" email address setting");
            }
        } catch (APIException e) {
            log.error("Gateway API call failed, could not send email - " + e.getCallInfo());
        }
    }

}