"use strict";

var passport = require('passport'),

    User     = require('./model/User');

var init = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {user: JSON.stringify(req.user)});
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
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
        User.find().select('-avatar').exec(function (err, docs) {
            if (err) {
                res.status(500).json({error: err});
                return;
            }

            res.json(docs);
        });
    });

    app.put('/users/:id', function (req, res) {
        User.update({_id: req.params.id}, {$set: req.body}, function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            if (count) {
                res.status(200).json({});
            } else {
                res.status(404).json({});
            }
        });
    });
};

module.exports.init = init;
