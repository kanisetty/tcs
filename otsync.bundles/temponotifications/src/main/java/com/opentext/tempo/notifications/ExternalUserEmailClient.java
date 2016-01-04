package com.opentext.tempo.notifications;

import com.opentext.otag.rest.util.Mail;

import javax.mail.MessagingException;
import javax.servlet.ServletContext;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

public class ExternalUserEmailClient {

    private final Mail mail = new Mail();

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
        mail.SendEmail(email, subjectStringWriter.toString(), bodyStringWriter.toString());
    }

}

