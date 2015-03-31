"use strict";

var $               = require('jquery'),
    _               = require('underscore'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    routes          = require('../utils/routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath),

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    AuthConstants   = require('../constants/AuthConstants');

var initUser = function () {
    var el = $('#user'),
        user = null;
    var userString = el.data('user');
    if (userString !== undefined) {
        if (userString.length) {
            user = JSON.parse(userString);
        }
        el.remove();
    }

    return user;
};

var _user = initUser();

var Store = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    },

    emitUnauthorized: function (e) {
        this.emit(AuthConstants.AUTH_UNAUTHORIZED, e);
    },

    addUnauthorizedListener: function (cb) {
        this.addListener(AuthConstants.AUTH_UNAUTHORIZED, cb);
    },

    removeUnauthorizedListener: function (cb) {
        this.removeListener(AuthConstants.AUTH_UNAUTHORIZED, cb);
    },

    getUser: function () {
        return _user;
    },

    loggedIn: function () {
        return !!_user;
    }
});


AppDispatcher.register(function (action) {
    var options = assign({}, action.data);

    switch (action.type) {
        case AuthConstants.AUTH_SIGNUP:
            api.call('auth:signup', options).done(function (response) {
                _user = response;
                Store.emitChange();
            });
            //_user = action.data;
            Store.emitChange();

            break;
        case AuthConstants.AUTH_LOGIN:
            api.call('auth:login', options).done(function (response) {
                _user = response;
                Store.emitChange();
            }).fail(function (res) {
                Store.emitUnauthorized(res);
            });
            Store.emitChange();

            break;
        case AuthConstants.AUTH_LOGOUT:
            api.call('auth:logout', options).done(function (response) {
                _user = null;
                Store.emitChange();
            });
            break;
    }
});

module.exports = Store;
