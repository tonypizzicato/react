"use strict";

var passport              = require('passport'),
    PassportStrategyLocal = require('passport-local').Strategy,

    User                  = require('./model/User');

var init = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                done(err);
            } else {
                done(null, user.toJSON());
            }
        });
    });

    var authHandler = function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user || !user.verifyPassword(password)) {
                return done(null, false, {message: 'Incorrect credentials.'});
            }

            return done(null, user);
        });
    };

    passport.use(new PassportStrategyLocal({
        usernameField:     'email',
        passwordField:     'password'
    }, authHandler));
};

module.exports.init = init;
