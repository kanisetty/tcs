<%@ page import="java.io.*,java.util.Locale" %>
<%@ page import="javax.servlet.*,javax.servlet.http.* " %>
<%@ page import="com.opentext.otsync.content.ws.ServletConfig" %>

<%
    // prevent caching of this page
    response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
    response.setHeader("Pragma", "no-cache"); //HTTP 1.0
    response.setDateHeader("Expires", 0); //prevents caching at the proxy server
    response.setHeader("X-Frame-Options", "SAMEORIGIN"); //prevent clickjacking attacks

    //Get the client's Locale (language and country)
    Locale locale = request.getLocale();
    String language = locale.getLanguage();
    String country = locale.getCountry();
%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="otd" uri="/WEB-INF/dispatchtags.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%--
	Set developerMode value="${true}" if you want to allow a developer
	to pass a repo value in via the URL (a GET request)
--%>
<%--
	If tempo is not enabled, redirect to a dummy page.
--%>
<%
    if (!ServletConfig.isTempoBoxEnabled()) response.sendRedirect("notempobox.html");
%>
<c:set var="developerMode" value="${false}"/>
<c:set var="repo" value=""/>
<c:set var="contentServerDirectBaseURL" value=""/>
<c:set var="contentServerDirectRelativeURL" value=""/>

<%--
	Comment: section used for debugging localization.

	Only load if it is not en-US as the en-US is included in dispatch.js 
	This allows en-US to act as the fallback if a locale has an incomplete
	translation.
--%>
<c:set var="language" value="<%=language %>"/>
<c:if test='${not(empty param.userPrefUILang)}'>
    <c:set var="language" value="${otd:toHTMLString(param.userPrefUILang)}"/>
</c:if>

<%--
	Default to en-US unless German.
	Note: This will need to expand to include other languages once tested.
--%>
<c:choose>
    <c:when test='${language eq "de"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "es"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "fr"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "ja"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "it"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "nl"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "pt"}'>
        <c:set var="lang" value="pt-BR"/>
    </c:when>
    <c:when test='${language eq "ru"}'>
        <c:set var="lang" value="${language}"/>
    </c:when>
    <c:when test='${language eq "zh"}'>
        <c:set var="lang" value="zh-CN"/>
    </c:when>
    <c:otherwise>
        <c:set var="lang" value="en-US"/>
    </c:otherwise>
</c:choose>
<%--
	 for security purposes, only accept a repo from the request if
	 we are in developer mode. otherwise use the info from the web.xml file
--%>
<c:choose>
    <c:when test="${developerMode && (param.repo != null)}">
        <c:set var="repo" value="${param.repo}"/>
    </c:when>
    <c:otherwise>
        <c:set var="repo" value="<%=ServletConfig.getRepo()%>"/>
    </c:otherwise>
</c:choose>
<c:set var="contentServerDirectBaseURL" value="<%=ServletConfig.getContentServerDirectBaseURL()%>"/>
<c:set var="contentServerDirectRelativeURL" value="<%=ServletConfig.getContentServerDirectRelativeURL()%>"/>
<%--
	Check for presence of redirect.js file in the repo to see if we need
	alter the destination. If found we will read this file, which should contain
	a single line that will be treated as the new repo address. This allows a repo
	maintainer to support the following structure:
	
		http://example.org/repo/latest/redirect.js -> http://example.org/repo/2_x
		http://example.org/repo/2_x/redirect.js -> http://example.org/repo/2_2
		http://example.org/repo/2_2/
		http://example.org/repo/2_1/
		http://example.org/repo/2_0/
		http://example.org/repo/1_x/redirect.js -> http://example.org/repo/1_1
		http://example.org/repo/1_1/
		http://example.org/repo/1_0/

	Now each administrator can point their repo at either a specific version (eg 1_0)
	or they can choose to only auto update minor releases (eg 1_x )
	or they can choose to always go to the lastest version (eg latest )

	The repo maintainer will need to update the redirect.js file whenever a new version
	is made available in order to have it point at the new version. In this scenario
	the repo maintainer would update 2_x/redirect.js whenever a new minor version of 2
	is realeased. When 3_0 is release they would create a 3_x/redirect.js file to point
	at 3_0 and then update latest/redirect.js to point at 3_x

--%>
<c:set var="originalRepo" value="${repo}"/>
<c:choose>
    <c:when test="${empty originalRepo}">
        <c:set var="repo" value="."/>
    </c:when>
    <c:otherwise>
        <c:catch var="exception">
            <c:import url="${repo}/redirect.js" var="newerRepo"/>
        </c:catch>
        <c:if test="${exception eq null}">
            <c:set var="repo" value="${fn:trim(newerRepo)}"/>
            <c:catch var="exception">
                <c:import url="${repo}/redirect.js" var="newestRepo"/>
            </c:catch>
            <c:if test="${exception eq null}">
                <c:set var="repo" value="${fn:trim(newestRepo)}"/>
            </c:if>
        </c:if>
    </c:otherwise>
</c:choose>
<%--
	everything appears good, so draw the basic html required to load the interface
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <!-- ${originalRepo} = ${repo} -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8"/>
    <meta http-equiv="Expires" CONTENT="0"/>
    <meta http-equiv="Pragma" CONTENT="no-cache"/>
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <meta http-equiv="Cache-Control" content="max-age=0"/>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>

    <title><%=ServletConfig.getProductName() %>
    </title>
    <link type="text/css" rel="stylesheet" href="${otd:toHTMLString(repo)}/css/tempo.css"/>
    <link rel="shortcut icon" type="image/ico" href="${otd:toHTMLString(repo)}/img/favicon.ico">
    <!--<script src="/webaccess/js/otag.js"></script>-->
    <script>

        /*if (top == self) {
            //page is not available to access directly
            window.location.replace("/webaccess/#tab=content");
        }*/

        info = {
            repo: '${otd:toJSString(repo,256)}',
            lang: '${lang}',
            cstoken: '${otd:toJSString(param.frontChannelToken,250)}',
            userID:        ${otd:toJSInt(param.userID)},
            userName: '${otd:toJSString(param.userName,255)}',
            userPrefUILang: '${otd:toJSString(param.userPrefUILang,250)}',
            userRootFolderID:    ${otd:toJSInt(param.userRootFolderID)},
            userRootFolderName: '${otd:toJSString(param.userRootFolderName,248)}',
            contentServerURL: '${otd:toJSString(contentServerDirectBaseURL,250)}${otd:toJSString(contentServerDirectRelativeURL,250)}',
            shortTimeFormat: '${otd:toJSString(param.shortTimeFormat,50)}',
            shortDateFormat: '${otd:toJSString(param.shortDateFormat,50)}',
            longTimeFormat: '${otd:toJSString(param.longTimeFormat,100)}',
            longDateFormat: '${otd:toJSString(param.longDateFormat,100)}',
            sessionExpiredMessage: '${otd:toJSString(param.sessionExpiredMessage,500)}',
            documentCreateInSubtype: '${otd:toJSString(param.documentCreateInSubtype,2000)}',
            folderCreateInSubtype: '${otd:toJSString(param.folderCreateInSubtype,2000)}',
            versionCreateInSubtype: '${otd:toJSString(param.versionCreateInSubtype,1000)}',
            userPrefDictionary: {},
            isAdminModeRequested: <%= Boolean.parseBoolean(request.getParameter("isAdminMode"))%>,
            shareAsUserID: ${otd:toJSInt(param.shareAsUserID)},
            browseUserName: '${otd:toJSString(param.browseUserName,1000)}'
        }
    </script>
    <script src="${otd:toHTMLString(repo)}/js/tempo.js"></script>
    <script src="${otd:toHTMLString(repo)}/locales/${lang}.js"></script>
</head>
<body>
<div id="tempo-main"></div>
</body>
</html>

