var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();
var port = 1234;
var appName = "Notification Center";
var dbName = "notificationcenter";

app.use(bodyParser.json()); 
app.use(compression());
app.use(express.static(__dirname + '/public'));

//app.use(require("./auth"));
//app.use("/api/posts", require("./api/controllers/posts"));
//app.use("/api/sessions", require("./api/controllers/sessions"));
//app.use("/api/users", require("./api/controllers/users"));

app.use("/api/devices", require("./api/controllers/devices"));
app.use("/api/notifications", require("./api/controllers/notifications"));
app.use("/api/settings", require("./api/controllers/settings"));

app.listen(port, function(){
	console.log("Running on port: " + port);
});