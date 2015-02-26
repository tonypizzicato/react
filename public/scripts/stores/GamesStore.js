"use strict";

var _               = require('underscore'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    api             = require('../utils/api'),

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    GamesConstants  = require('../constants/GamesConstants');


var _games = [];

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _games;
    },

    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    emitEvent: function (type, data) {
        this.emit(type, data);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    },

    addEventListener: function (type, cb) {
        this.addListener(type, cb);
    },

    removeEventListener: function (type, cb) {
        this.removeListener(type, cb);
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case GamesConstants.GAMES_LOAD:
            var call = api.call('games:list', action.data).done(function (response) {
                _games = response;
                Store.emitChange();
            });
            Store.emitEvent(EventsConstants.EVENT_CALL, call);

            break;
    }
});

module.exports = Store;