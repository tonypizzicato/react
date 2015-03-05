"use strict";

var _               = require('underscore'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    api             = require('../utils/api'),

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    AuthConstants   = require('../constants/AuthConstants');


var _user = null;

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

    getUser: function () {
        return _user;
    },

    loggedIn: function () {
        return !!_user;
    }
});


AppDispatcher.register(function (action) {
    var options = assign({}, action.data, {host: 'http://localhost:3000'});

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
