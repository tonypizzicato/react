"use strict";

var _               = require('underscore'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    OrdersConstants = require('../constants/OrdersConstants'),

    routes          = require('../utils/api-routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath);

var _orders          = [];

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _orders;
    },

    getByLeague: function (leagueId) {
        return _orders.filter(function (item) {
            return item.leagueId == leagueId;
        });
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
        case OrdersConstants.ORDERS_LOAD:
            api.call('orders:list').done(function (result) {
                _orders = result;
                Store.emitChange();
            });

            break;
        default:
            break;
    }
});

module.exports = Store;
