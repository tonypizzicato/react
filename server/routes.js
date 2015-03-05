"use strict";

var passport = require('passport'),

    User     = require('./model/User');

var init = function (app) {
    app.post('/login', passport.authenticate('local'), function (req, res) {
        console.dir(arguments);

        res.json(res);
    });

    app.post('/signup', function (req, res) {
        User.create(req.body, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            console.log(arguments);
            res.json(user);
        })
    });
};

module.exports.init = init;
