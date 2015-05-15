var Settings = require("../models/settings");
var router = require("express").Router();
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
//var config = require("../../config");

router.get('/', function (req, res, next) {
    Settings.find()
        .select("-_id -__v")
        .exec(function(err, settings) {
            if (err) {
                return next(err);
            }
            res.json(settings);
        });
});

router.post("/", function(req, res, next) {

    Settings.findOneAndUpdate(
        //query
        {
            //blank query
        },
        //update doc
        {
            "android_apikey" : req.body.android_apikey
        },
        //options
        {
            "upsert" : true
        },
        //callback
        function(err, settings) {
            if(err) {
                throw next(err);
            }
            console.log(settings);
            res.json(settings);
        }
    );

});

module.exports = router;