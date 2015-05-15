/**
 * Created by ndeakin on 29/04/2015.
 */
var db = require("../db");

var notification = db.Schema({
    username: String,
    notificationData: String
});

module.exports = db.model("Notification", notification);