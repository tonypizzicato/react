"use strict";

var passport = require('passport'),

    User     = require('./model/User');

var init = function (app) {

    app.get('*', function (req, res, next) {
        console.log(req.sessionID);
        console.log(req.session.passport);

        next();
    });

    app.get('/', function (req, res) {
        console.log('index page requested');
        res.render('index', {user: JSON.stringify(req.user)});
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
        console.log('login route handled: ' + req.user);
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

    app.get('/users', function (req, res) {
        User.find().exec(function (err, docs) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            res.json(docs);
        });
    });
};

module.exports.init = init;
