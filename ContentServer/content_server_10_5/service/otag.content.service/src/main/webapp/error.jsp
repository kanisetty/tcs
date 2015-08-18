<%@ page import="com.opentext.ecm.otsync.ws.ServletConfig" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><%=ServletConfig.getProductName() %> Server Error</title>
</head>
<body>
<h3 style="background-color: #2288CC; text-align: center;"><%=ServletConfig.getProductName() %> has encountered an unexpected problem.</h3>
<p>Details for troubleshooting are available in the server log.</p>
<p style="background-color: #ffffaa; text-align: center;"><em>Please contact your system administrator.</em></p>
</body>
</html>