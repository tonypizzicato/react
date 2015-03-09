"use strict";

var _ = require('underscore'),
    moment = require('moment'),
    assign = require('object-assign'),
    EventEmitter = require('events').EventEmitter,

    AppDispatcher = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    CountriesConstants = require('../constants/CountriesConstants'),

    routes = require('../utils/api-routes'),
    api = require('../utils/api').init(routes.routes, routes.basePath);


var _countries = [],
    _validationError = null;

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _countries;
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
     * @param {Object} New country object
     * @returns {boolean}
     *
     * @private
     */
    _validate: function (country) {
        var notEmpty = function (value) {
            return value.toString().length > 0;
        };

        var rules = {
            name: notEmpty,
            slug: notEmpty,
            leagueId: notEmpty
        };

        return this._isValid(country, rules);
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
        case CountriesConstants.COUNTRIES_LOAD:
            console.log('"' + action.type + '" handled');
            var call = api.call('countries:list').done(function (result) {
                _countries = result;
                Store.emitChange();
            });

            Store.emitEvent(EventsConstants.EVENT_CALL, call);
            break;

        case CountriesConstants.COUNTRIES_ADD:
            var countries = _countries.slice(0);

            var country = assign({}, action.data);
            country.sort = countries.length ? countries.sort(function (a, b) {
                return a.sort > b.sort ? 1 : -1;
            }).pop().sort + 1 : 1;

            if (Store._validate(country)) {
                api.call('countries:create', country).then(function (res) {
                    _countries.push(res);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case CountriesConstants.COUNTRIES_SAVE:
            var country = action.data;

            if (Store._validate(country)) {
                api.call('countries:save', country).then(function () {
                    var changed = _countries.filter(function (item) {
                        return item._id == country._id;
                    }).pop();

                    assign(changed, country);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case CountriesConstants.COUNTRIES_DELETE:
            api.call('countries:delete', {_id: action.data._id}).then(function () {
                _countries = _.filter(_countries, function (item) {
                    return item._id != action.data._id
                });

                Store.emitChange();
            });
            break;

        default:
            console.log('action "' + action.type + '" was not handled in Countries store');
    }
});

module.exports = Store;
