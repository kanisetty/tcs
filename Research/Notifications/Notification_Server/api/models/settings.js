/**
 * Created by ndeakin on 29/04/2015.
 */
var db = require("../db");

var settings = db.Schema({
    android_apikey: String
});

module.exports = db.model("Settings", settings);