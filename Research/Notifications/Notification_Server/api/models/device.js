/**
 * Created by ndeakin on 29/04/2015.
 */
var db = require("../db");

var device = db.Schema({
    username: String,
    regid: String
});

module.exports = db.model("Device", device);