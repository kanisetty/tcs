<%@ page import="java.io.*,java.util.Locale" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
	Locale locale = request.getLocale();
	String language = locale.getLanguage();
%>

<c:set var="language" value="<%=language %>" />
<c:choose>
	<c:when test='${language eq "de"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "es"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "fr"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "ja"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "it"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "nl"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "pt"}'>
		<c:set var="lang" value="pt-BR" />
	</c:when>
	<c:when test='${language eq "ru"}'>
		<c:set var="lang" value="${language}" />
	</c:when>
	<c:when test='${language eq "zh"}'>
		<c:set var="lang" value="zh-CN" />
	</c:when>
	<c:otherwise>
		<c:set var="lang" value="en-US" />
	</c:otherwise>
</c:choose>

<html>
<body>

<%
String lang = (String)pageContext.getAttribute("lang");
String redirectURL = new String("help/"+ lang +"/webui/_manual.htm");
response.sendRedirect( redirectURL );
%>
</body>
</html>