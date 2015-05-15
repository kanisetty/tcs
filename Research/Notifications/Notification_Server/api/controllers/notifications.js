var Notification = require("../models/notification");
var Settings = require("../models/settings");
var Device = require("../models/device");
var router = require("express").Router();
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
//var config = require("../../config");

router.get('/', function (req, res, next) {
    Notification.find()
        .sort("username")
        .select("-_id -__v")
        .exec(function(err, notifications) {
            if (err) {
                return next(err);
            }
            res.json(notifications);
        });
});

router.post("/", function(req, res, next) {

    if(req.body.username && req.body.notificationData) {
        var notification = new Notification({
            username: req.body.username,
            notificationData: req.body.notificationData
        });
        notification.save(function (err, notification) {

            if (err) {
                throw next(err);
            }
            sendNotification(req.body, function(err) {

                if (err) {
                    throw next(err);
                }
                res.status(201).json(notification);
            } );

        });
    } else {
        res.status(500).send();
    }

});

router.post("/remove", function(req, res, next) {

    Notification.remove(
        {
            username : req.body.username,
            notificationData : req.body.notificationData
        },
        function(err, notification) {
            if(err) {
                throw next(err);
            }
            res.sendStatus(200);
        }
    );

});

function sendNotification(notificationData, callback) {

    var android = {
        "host" : "android.googleapis.com"
        , "path" : "/gcm/send"
        , "apikey" : null
    };

    var sendBody = {
        "registration_ids" : null
        , "data" :
            JSON.parse(notificationData.notificationData)
    }

    var bodyString = JSON.stringify(sendBody);

    var options = {
        host: android.host,
        port: '80',
        path: android.path,
        method: 'POST'
    };

    var headers = {};

    var http = require('http');
    var req = null;

    getAndroidApiKey(function(apikey) {
        getRegids(notificationData.username, function(regids) {
            sendBody.registration_ids = regids;

            var sendBodyString = JSON.stringify(sendBody)
            headers = {
                'Content-Type': 'application/json',
                    'Content-Length': sendBodyString.length,
                    'Authorization': apikey
            }
            options.headers = headers;

            req = http.request(options, function(res) {
                res.setEncoding('utf-8');
                var responseString = '';
                res.on('data', function(data) {
                    responseString += data;
                });
                res.on('end', function() {
                    console.log(responseString);
                    var resultObject = JSON.parse(responseString);
                    callback();
                });
            });
            req.write(sendBodyString);
            req.end();
        });
    })

}

function getAndroidApiKey(cb) {
    var apikey = null;

    Settings.find()
        .select("android_apikey")
        .exec(function(err, settings) {
            if (err) {
                return next(err);
            }
            cb(settings[0].android_apikey);
        });

}

function getRegids(username, cb) {
    var regids = [];

    Device.find()
        .select("regid -_id")
        .where("username").equals(username)
        .exec(function(err, devices) {
            if (err) {
                return next(err);
            }
            for(var i = 0; i < devices.length; i++) {
                regids.push(devices[i].regid);
            }
            cb(regids);
        });
}

module.exports = router;