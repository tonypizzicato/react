"use strict";

var _                    = require('underscore'),
    moment               = require('moment'),
    assign               = require('object-assign'),
    EventEmitter         = require('events').EventEmitter,

    AppDispatcher        = require('../dispatcher/app-dispatcher'),

    EventsConstants      = require('../constants/EventsConstants'),
    TournamentsConstants = require('../constants/TournamentsConstants'),

    api                  = require('../utils/api');


var _tournaments = [];

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _tournaments;
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
        case TournamentsConstants.TOURNAMENTS_LOAD:
            console.log('"' + action.type + '" handled');
            var call = api.call('tournaments:list').done(function (result) {
                _tournaments = result;
                Store.emitChange();
            });

            Store.emitEvent(EventsConstants.EVENT_CALL, call);
            break;
    }
});

module.exports = Store;