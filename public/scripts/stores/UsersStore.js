"use strict";

var assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    UsersConstants  = require('../constants/UsersConstants'),

    routes          = require('../utils/routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath);


var _users = [];

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _users;
    },

    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case UsersConstants.USERS_LOAD:
            console.log('"' + action.type + '" handled');
            api.call('users:list').done(function (res) {
                _users = res;
                Store.emitChange();
            });

            break;

        default:
            console.log('action "' + action.type + '" was not handled in Users store');
    }
});

module.exports = Store;
