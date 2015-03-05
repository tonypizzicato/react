"use strict";

var passport              = require('passport'),
    PassportStrategyLocal = require('passport-local'),

    User                  = require('./model/User');

var init = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());


    var authHandler = function (username, password, done) {
        console.dir(arguments);
        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    };

    passport.use(new PassportStrategyLocal(authHandler));
}

module.exports.init = init;
