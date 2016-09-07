<%@page import="java.text.MessageFormat" %>
<%@ page import="java.util.regex.*" %>
<%@ page import="com.opentext.otsync.content.ws.ServletConfig" %>
<%@ page import="com.opentext.otsync.content.ws.server.ClientType" %>
<%@ page import="com.opentext.otsync.content.ws.server.ClientTypeSet" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
        %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.io.*,java.util.Locale" %>
<%@ page import="static com.opentext.otsync.content.ws.ServletConfig.*" %>

<%--
	If tempo is not enabled, redirect to a dummy page.
--%>
<%
    if (!isTempoBoxEnabled()) {
        response.sendRedirect("notempobox.html");
    }
%>

<%
    //Fixed Links for Android and iOS
    String androidLink = "https://play.google.com/store/apps/details?id=com.opentext.m.tempo";
    String iOSLink = "https://itunes.apple.com/ca/app/opentext-tempo/id781547141";

    String minIOSVersion = "8_0";
    String minAndroidVersion = "4.2";
%>

<%
    //Get the client's Locale (language and country)
    Locale locale = request.getLocale();
    String language = locale.getLanguage();
%>
<%@ include file="language/en-US.jsp" %>

<c:set var="lang" value="<%=language %>"/>
<c:if test='${not(empty param.ln)}'>
    <c:set var="lang" value="${param.ln}"/>
</c:if>
<%-- Verified that lang is one of the supported languages to override String variables in en-Us.jsp --%>
<c:choose>
    <c:when test='${lang == "de"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/de.jsp" %>
    </c:when>
    <c:when test='${lang == "es"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/es.jsp" %>
    </c:when>
    <c:when test='${lang == "fr"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/fr.jsp" %>
    </c:when>
    <c:when test='${lang == "it"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/it.jsp" %>
    </c:when>
    <c:when test='${lang == "ja"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/ja.jsp" %>
    </c:when>
    <c:when test='${lang == "nl"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/nl.jsp" %>
    </c:when>
    <c:when test='${lang == "pt"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/pt-BR.jsp" %>
    </c:when>
    <c:when test='${lang == "ru"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/ru.jsp" %>
    </c:when>
    <c:when test='${lang == "zh"}'>
        <c:set var="lang" value="${lang}"/>
        <%@ include file="language/zh-CN.jsp" %>
    </c:when>
    <c:otherwise>
        <c:set var="lang" value="en-US"/>
    </c:otherwise>
</c:choose>

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
    String bbVersion = "0";
    String androidVersion = "0";
    Boolean osVersionNotSupported = false;
    Boolean osNotSupported = false;

    // crude sanitation of language variable
    if (language.toLowerCase().contains("de")) {
        language = "de";
    } else if (language.toLowerCase().contains("es")) {
        language = "es";
    } else if (language.toLowerCase().contains("fr")) {
        language = "fr";
    } else if (language.toLowerCase().contains("it")) {
        language = "it";
    } else if (language.toLowerCase().contains("ja")) {
        language = "ja";
    } else if (language.toLowerCase().contains("nl")) {
        language = "nl";
    } else if (language.toLowerCase().contains("pt")) {
        language = "pt";
    } else if (language.toLowerCase().contains("ru")) {
        language = "ru";
    } else if (language.toLowerCase().contains("zh")) {
        language = "zh";
    } else {
        language = "en";
    }

    if (userAgent != null) {
        // try to automatically detect os if it is not passed in
        if (os == null) {
            if (userAgent.toUpperCase().contains("WINDOWS")) {
                os = "win";
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
                os = "MacOS";
            } else if (userAgent.toUpperCase().contains("IPOD") || userAgent.toUpperCase().contains("IPHONE") || userAgent.toUpperCase().contains("IPAD")) {
                os = "iOS";
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
                os = "android";
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


    ClientTypeSet clientTypeSet = new ClientTypeSet();

    if ("android".equalsIgnoreCase(os)) {
        downloadText = and_downloadText;

        if (androidVersion.compareTo("2.1") < 0) {
            osVersionNotSupported = true;
        }
    }
    else if ("ios".equalsIgnoreCase(os)) {
        downloadText = ios_downloadText;

        if (iOSVersion.compareTo("4_3") < 0) {
            osVersionNotSupported = true;
        }
    }
    else if ("win".equalsIgnoreCase(os)) {

        ClientType client32 = clientTypeSet.getClient("win", "32");
        ClientType client64 = clientTypeSet.getClient("win", "64");

        if (client32 == null || client64 == null) {
            osNotSupported = true;
        } else if (bit != null && "32".equals(bit)) {
            version = client32.getCurrentVersion();
            downloadText = win_download_text_32_bit;
            altText = (showBoth) ? win_download_text_64_bit : win_alttext_64_bit;
            location = client32.getLink(language);
            altLocation = client64.getLink(language);
        } else if (bit != null && "64".equals(bit)) {
            version = client64.getCurrentVersion();
            downloadText = win_download_text_64_bit;
            altText = (showBoth) ? win_download_text_32_bit : win_alttext_32_bit;
            location = client64.getLink(language);
            altLocation = client32.getLink(language);
        } else {
            version = client32.getCurrentVersion();
            downloadText = win_download_text_32_bit;
            altText = win_alttext_64_bit;
            location = client32.getLink(language);
            altLocation = client64.getLink(language);
        }
    }
    else if ("MacOS".equalsIgnoreCase(os)) {

        ClientType clientMac = clientTypeSet.getClient("macOS", "");

        version = clientMac.getCurrentVersion();
        downloadText = mac_downloadText;
        location = clientMac.getLink(language);
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

    <% if ("android".equalsIgnoreCase(os) || "ios".equalsIgnoreCase(os)) { %>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.css"/>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.0a4.1/jquery.mobile-1.0a4.1.min.js"></script>
    <% } %>
</head>
<body>


<% if ("android".equalsIgnoreCase(os) && !osNotSupported) { %>
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
            <a id="androidDownloadLink" href="<% out.print(androidLink); %>" data-role="button"
               rel="external"><%=and_install_build %>
            </a>
        </div>
        <% } %>

    </div>
    <!-- /content -->
</div>
<!-- /page -->
<% } else if ("ios".equalsIgnoreCase(os) && !osNotSupported) { %>
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
                    <a id="iOSDownloadLink" href="<% out.print(iOSLink); %>" data-role="button"
                       rel="external"><%=ios_install_build%>
                    </a>
                </div>
            <% } %>

    </div>
    <!-- /content -->
</div>
<!-- /page -->
<% } else if ("win".equalsIgnoreCase(os) && !osNotSupported) { %>
<div id="info">
    <div id="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
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
<%} else if ("MacOS".equalsIgnoreCase(os) && !osNotSupported) { %>
<div id="info">
    <div id="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
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
    <div id="info">
        <div id="title"><img src="images/tempo_wordmark.png" alt="Tempo Title"></div>
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
