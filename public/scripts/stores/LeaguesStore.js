"use strict";

var _                = require('lodash'),
    assign           = require('object-assign'),
    EventEmitter     = require('events').EventEmitter,

    routes           = require('../utils/api-routes'),
    api              = require('../utils/api').init(routes.routes, routes.basePath),

    AppDispatcher    = require('../dispatcher/app-dispatcher'),

    EventsConstants  = require('../constants/EventsConstants'),
    LeaguesConstants = require('../constants/LeaguesConstants');


var _leagues         = [],
    _validationError = {};

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _leagues;
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
    },

    /**
     * @returns {Object|null} Validation error object
     *
     * @private
     */
    _getValidationError: function () {
        var err = _validationError;
        _validationError = null;

        return err;
    },

    /**
     * @param {Object} New tournament object
     * @returns {boolean}
     *
     * @private
     */
    _validate: function (tournament) {
        var notEmpty = function (value) {
            return value.toString().length > 0;
        };

        var rules = {
            name: notEmpty,
            slug: notEmpty
        };

        return this._isValid(tournament, rules);
    },

    _isValid: function (entity, rules) {

        var result = true,
            ruleResult;

        for (var rule in rules) {
            if (entity.hasOwnProperty(rule)) {
                ruleResult = rules[rule](entity[rule]);
                if (!ruleResult) {
                    _validationError = _validationError || {};
                    _validationError[rule] = true;
                    result = false;
                }
            }
        }

        return result;
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case LeaguesConstants.LEAGUES_LOAD:
            var call = api.call('leagues:list').done(function (response) {
                _leagues = response;
                Store.emitChange();
            });

            Store.emitEvent(EventsConstants.EVENT_CALL, call);

            break;

        case LeaguesConstants.LEAGUES_SAVE:
            var league = assign({}, action.data),
                options = assign({}, {validate: true, silent: false}, action.options);

            if (!options.validate || Store._validate(action.data)) {
                api.call('leagues:save', action.data).then(function () {
                    var changed = _.findWhere(_leagues, {_id: league._id});

                    assign(changed, league);
                    _leagues.sort(function (a, b) {
                        return a.sort <= b.sort ? -1 : 1
                    });
                    if (!options.silent) {
                        Store.emitChange();
                    }
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;
    }
});

module.exports = Store;
