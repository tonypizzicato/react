"use strict";

var passport = require('passport'),

    User     = require('./model/User');

var init = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {user: JSON.stringify(req.user)});
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
        console.log('login route handled: ' + res);
        res.json(req.user);
    });

    app.post('/signup', function (req, res) {
        User.create(req.body, function (err, user) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            passport.authenticate('local')(req, res, function () {
                res.json(user);
            });
        })
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.json({});
    });
};

module.exports.init = init;
