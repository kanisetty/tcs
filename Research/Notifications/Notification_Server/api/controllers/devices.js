var Device = require("../models/device");
var router = require("express").Router();
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
//var config = require("../../config");

router.get('/', function (req, res, next) {
    Device.find()
        .sort("username")
        .select("-_id -__v")
        .exec(function(err, devices) {
            if (err) {
                return next(err);
            }
            res.json(devices);
        });
});

router.post("/", function(req, res, next) {

    if(req.body.username && req.body.regid) {
        var device = new Device({
            username: req.body.username,
            regid: req.body.regid
        });
        device.save(function (err, device) {
            if (err) {
                throw next(err);
            }
            res.status(201).json(device);
        });
    } else {
        res.status(500).send();
    }

});

router.post("/remove", function(req, res, next) {

    Device.remove(
        {
            username : req.body.username,
            regid : req.body.regid
        },
        function(err, device) {
            if(err) {
                throw next(err);
            }
            res.sendStatus(200);
        }
    );

});

module.exports = router;