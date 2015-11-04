<%@ page import="com.opentext.otsync.content.ws.ServletConfig" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><%=ServletConfig.getProductName() %> Client Administration Setup</title>
    <link rel="stylesheet" href="css/tracker.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/setup.css" type="text/css" media="all"/>
    <script src="js/jquery-1.8.0.min.js"></script>
    <script src="js/jquery-ui-1.8.23.custom.min.js"></script>
    <script src="js/setup.js"></script>
</head>
<body>
<div id="login" class="ui-widget">
    <div class="tracker-header">
        <%=ServletConfig.getProductName() %> Client Management Setup
    </div>

    <div class="container">
        <div id="login-wrapper">
            <div id="login-pane" class="content-pane">
                <div class="login-top">Log-in</div>

                <div class="control">
                    <div class="login-left"><label for="username" class="tracker-label">Username:</label></div>
                    <div class="login-right"><input type="text" id="username"/></div>
                </div>

                <div class="control">
                    <div class="login-left"><label for="password" class="tracker-label">Password:</label></div>
                    <div class="login-right"><input type="password" id="password"/></div>
                </div>

                <div class="login-bottom">
                    <div class="login-right">
                        <button id="loginButton" class="ui-button-primary">Login</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="tracker-footer">
            Copyright &copy; 2012 Open Text Corporation. All rights reserved.
        </div>
    </div>
</div>

<div id="setup" class="ui-widget">
    <div class="tracker-header">
        <div class="header-title">Client Management Setup</div>
        <div class="user-actions">
            <button id="logoutButton" class="ui-button-primary ui-button-small">Logout</button>
        </div>
    </div>

    <div class="container content-pane">

        <div class="tracker-body">
            <div class="sub-header">
                <div class="sub-title">CLIENT MANAGEMENT SETUP</div>
            </div>
            <div id="setup-inputs" class="tracker-inputs">
                <div>
                    <label for="tracker-url">Client Tracker URL:</label>
                    <input type="text" id="tracker-url">
                </div>
                <div>
                    <label for="engine-url">Tempo Engine URL:</label>
                    <input type="text" id="engine-url">
                </div>
                <div>
                    <label for="tracker-key">Current Tracker Key:</label>
                    <input type="text" id="tracker-key">
                </div>
                <button id="setup-button" class="ui-button-primary ui-button-small">Initialize</button>
            </div>
            <div id="status-report">
                <div id="tracker-to-engine">Connecting tracker to <%=ServletConfig.getShortProductName() %>...</div>
                <div id="engine-to-tracker">Connecting <%=ServletConfig.getShortProductName() %> to tracker...</div>
                <div id="randomize-keys">Randomizing shared key...</div>
                <div id="success">Success. Setup complete. Please restart your Tomcat service.</div>
                <div id="error"></div>
                <div id="error-page"></div>
            </div>
        </div>
        <div class="tracker-footer">
            Copyright &copy; 2012 Open Text Corporation. All rights reserved.
        </div>

    </div>
</div>
</body>
</html>