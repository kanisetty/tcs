<%@ page import="java.text.MessageFormat" %>
<%@ page import="java.util.regex.*" %>
<%@ page import="com.opentext.otsync.content.ws.server.ClientType" %>
<%@ page import="com.opentext.otsync.content.ws.server.ClientTypeSet" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ page import="java.util.Locale" %>
<%@ page import="static com.opentext.otsync.content.ws.ServletConfig.*" %>

<%
    //If tempo is not enabled, redirect to a dummy page.
    if (!isTempoBoxEnabled()) {
        response.sendRedirect("notempobox.html");
    }

    //Constants
    String ANDROID_CLIENT_KEY = "android";
    String IOS_CLIENT_KEY = "iOS";
    String MAC_CLIENT_KEY = "macOS";
    String WIN_CLIENT_KEY = "win";

    //Get client info
    ClientTypeSet clientTypeSet = new ClientTypeSet();

    ClientType win32Client = clientTypeSet.getClient(WIN_CLIENT_KEY, "32");
    ClientType win64Client = clientTypeSet.getClient(WIN_CLIENT_KEY, "64");
    ClientType macClient = clientTypeSet.getClient(MAC_CLIENT_KEY, "");
    ClientType androidClient = new ClientType(ANDROID_CLIENT_KEY);
    ClientType iosClient = new ClientType(IOS_CLIENT_KEY);

    androidClient.setClientLink("https://play.google.com/store/apps/details?id=com.opentext.m.tempo");
    androidClient.setMinVersion("4.2");
    iosClient.setClientLink("https://itunes.apple.com/ca/app/opentext-tempo/id781547141");
    iosClient.setMinVersion("8_0");

    //Get the client's Locale (language and country)
    Locale locale = request.getLocale();
    String detectedLanguage = locale.getLanguage();
    String language = "en";

    String[] allowedLanguages = {"de", "en", "es", "fr", "it", "ja", "nl", "pt", "ru", "zh"};

    for (String s: allowedLanguages ){
        if (detectedLanguage.toLowerCase().contains(s)){
            language = s;
        }
    }

%>
<%@ include file="language/en-US.jsp" %>
<% if (language == "de") {%>
<%@ include file="language/de.jsp" %>
<% }else if (language == "es") {%>
<%@ include file="language/es.jsp" %>
<% }else if (language == "fr") {%>
<%@ include file="language/fr.jsp" %>
<% }else if (language == "it") {%>
<%@ include file="language/it.jsp" %>
<% }else if (language == "ja") {%>
<%@ include file="language/ja.jsp" %>
<% }else if (language == "nl") {%>
<%@ include file="language/nl.jsp" %>
<% }else if (language == "pt") {%>
<%@ include file="language/pt-BR.jsp" %>
<% }else if (language == "ru") {%>
<%@ include file="language/ru.jsp" %>
<% }else if (language == "zh") {%>
<%@ include file="language/zh-CN.jsp" %>
<% }%>



<%
    String userAgent = request.getHeader("User-Agent");
    String os = request.getParameter("os");
    String bit = request.getParameter("b");
    String location = null;
    String altLocation = null;
    String downloadText = null;
    String altText = null;
    String version = null;
    Boolean showBoth = false;
    String iOSVersion = "0";
    String androidVersion = "0";
    Boolean osVersionNotSupported = false;
    Boolean osNotSupported = false;


    if (userAgent != null) {
        // try to automatically detect os if it is not passed in
        if (os == null) {
            if (userAgent.toUpperCase().contains("WINDOWS")) {
                os = WIN_CLIENT_KEY;
                //try to automatically detect bit if it is not passed in (WOW64 for most browsers, WIN64 for some versions of Firefox)
                if (bit == null) {
                    if (userAgent.toUpperCase().contains("WOW64") || userAgent.toUpperCase().contains("WIN64")) {
                        bit = "64";
                    }
                    // don't default to 32-bit for older firefox browsers, as these don't include bitness
                    else if (!userAgent.toUpperCase().contains("GECKO")) {
                        bit = "32";
                    } else {
                        bit = "32";
                        showBoth = true;
                    }
                }
            } else if (userAgent.toUpperCase().contains("MACINTOSH")) {
                os = MAC_CLIENT_KEY;
            } else if (userAgent.toUpperCase().contains("IPOD") || userAgent.toUpperCase().contains("IPHONE") || userAgent.toUpperCase().contains("IPAD")) {
                os = IOS_CLIENT_KEY;
                /**
                 http://www.useragentstring.com/pages/Safari/
                 sample: "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5";
                 **/
                String iOSRegex = "OS ([\\d_]+) LIKE";
                Pattern pattern = Pattern.compile(iOSRegex);
                Matcher matcher = pattern.matcher(userAgent.toUpperCase());
                if (matcher.find()) {
                    iOSVersion = matcher.group(1);
                }
            } else if (userAgent.toUpperCase().contains("ANDROID")) {
                os = ANDROID_CLIENT_KEY;
                /**
                 http://www.useragentstring.com/pages/Android%20Webkit%20Browser/
                 sample: "Mozilla/5.0 (Linux; U; Android 2.0.3; zh-tw; HTC Pyramid Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";
                 **/
                String androidRegex = "ANDROID ([\\d\\.]+)";
                Pattern pattern = Pattern.compile(androidRegex);
                Matcher matcher = pattern.matcher(userAgent.toUpperCase());
                if (matcher.find()) {
                    androidVersion = matcher.group(1);
                }
            }
        }
    }


    if (ANDROID_CLIENT_KEY.equalsIgnoreCase(os)) {
        downloadText = and_downloadText;

        if (androidVersion.compareTo(androidClient.getMinVersion()) < 0) {
            osVersionNotSupported = true;
        }
    }
    else if (IOS_CLIENT_KEY.equalsIgnoreCase(os)) {
        downloadText = ios_downloadText;

        if (iOSVersion.compareTo(iosClient.getMinVersion()) < 0) {
            osVersionNotSupported = true;
        }
    }
    else if (WIN_CLIENT_KEY.equalsIgnoreCase(os)) {

        if (win32Client == null || win64Client == null) {
            osNotSupported = true;
        } else if (bit != null && "64".equals(bit)) {
            version = win64Client.getCurrentVersion();
            downloadText = win_download_text_64_bit;
            altText = (showBoth) ? win_download_text_32_bit : win_alttext_32_bit;
            location = win64Client.getLink(language);
            altLocation = win32Client.getLink(language);
        } else {
            version = win32Client.getCurrentVersion();
            downloadText = win_download_text_32_bit;
            altText = (showBoth) ? win_download_text_64_bit : win_alttext_64_bit;
            location = win32Client.getLink(language);
            altLocation = win64Client.getLink(language);
        }
    }
    else if (MAC_CLIENT_KEY.equalsIgnoreCase(os)) {

        version = macClient.getCurrentVersion();
        downloadText = mac_downloadText;
        location = macClient.getLink(language);
    }
    else {
        osNotSupported = true;
    }

%>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Update <%=getProductName() %> Client</title>
    <link rel="stylesheet" type="text/css" href="update.css" />

    <% if (ANDROID_CLIENT_KEY.equalsIgnoreCase(os) || IOS_CLIENT_KEY.equalsIgnoreCase(os)) { %>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.css"/>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.js"></script>
    <% } %>
</head>
<body>


<% if (ANDROID_CLIENT_KEY.equalsIgnoreCase(os) && !osNotSupported) { %>
<div data-role="page" data-theme="b">
    <div data-role="header"><h1><%=MessageFormat.format(ot_tempo_installer, getProductName())%>
    </h1></div>
    <div data-role="content">
        <p><%=MessageFormat.format(and_install_instruction, getProductName())%>
        </p>

        <p><%=and_install_instruction_2%>
        </p>

        <p><%=and_install_instruction_3%>
        </p>

        <p class="version-info">
            <%=android_os_detected_pre%> <%
            out.print(androidVersion); %> <%=and_os_detected_post%><% if (osVersionNotSupported) {%><%=and_version_not_supported %>
        </p><% }else{ %></p>
        <div data-role="controlgroup">
            <a id="androidDownloadLink" href="<% out.print(androidClient.getLink()); %>" data-role="button"
               rel="external"><%=and_install_build %>
            </a>
        </div>
        <% } %>

    </div>
    <!-- /content -->
</div>
<!-- /page -->
<% } else if (IOS_CLIENT_KEY.equalsIgnoreCase(os) && !osNotSupported) { %>
<div data-role="page" data-theme="b">
    <div data-role="header"><h1><%=MessageFormat.format(ot_tempo_installer, getProductName())%>
    </h1></div>
    <div data-role="content">
        <p><%=MessageFormat.format(ios_install_instruction, getProductName())%>
        </p>

        <p><%=ios_install_instruction_2%>
        </p>

        <p><%=ios_install_instruction_3%>
        </p>

        <p class="version-info">
            <%=ios_os_detected_pre%><%
            out.print(iOSVersion); %> <%=ios_os_detected_post%>
            <% if (osVersionNotSupported) {%>
            <%=ios_version_not_supported %>
        </p>
        <% }else{ %>
        </p>
        <div data-role="controlgroup">
            <a id="iOSDownloadLink" href="<% out.print(iosClient.getLink()); %>" data-role="button"
               rel="external"><%=ios_install_build%>
            </a>
        </div>
        <% } %>

    </div>
    <!-- /content -->
</div>
<!-- /page -->
<% } else if (WIN_CLIENT_KEY.equalsIgnoreCase(os) && !osNotSupported) { %>
<div class="info">
    <div class="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
    <div>
        <h3><%=win_version%> <% out.print(version); %></h3>

        <p><%=MessageFormat.format(win_reliable_etc, getCompanyName())%>
        </p>
    </div>
    <% if (showBoth) { %>
    <div class="download-button">
        <a href="<% out.print(location); %>"><% out.print(downloadText); %></a>
    </div>
    <div class="download-button">
        <a href="<% out.print(altLocation); %>"><% out.print(altText); %></a>
    </div>
    <% } else { %>
    <div class="download-button">
        <a href="<% out.print(location); %>"><% out.print(downloadText); %></a>
    </div>
    <div class="alt-link">
        <p><%=win_or_download%><a href="<% out.print(altLocation); %>"><% out.print(altText); %></a></p>
    </div>
    <% } %>
</div>
<%} else if (MAC_CLIENT_KEY.equalsIgnoreCase(os) && !osNotSupported) { %>
<div class="info">
    <div class="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
    <div>
        <h3><%=win_version%> <% out.print(version); %></h3>

        <p><%=MessageFormat.format(win_reliable_etc, getCompanyName())%>
        </p>
    </div>
    <div class="download-button">
        <a href="<% out.print(location); %>"><% out.print(downloadText); %></a>
    </div>
</div>
<% } else { %>
<div data-role="page" data-theme="b">
    <div class="info">
        <div class="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
        <div data-role="content">
            <p><%=platform_not_supported%>
            </p>
        </div>
        <!-- /content -->
    </div>
</div>
<% } %>

</body>
</html>
