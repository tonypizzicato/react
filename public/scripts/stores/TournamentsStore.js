"use strict";

var _                    = require('lodash'),
    assign               = require('object-assign'),
    EventEmitter         = require('events').EventEmitter,

    AppDispatcher        = require('../dispatcher/app-dispatcher'),

    EventsConstants      = require('../constants/EventsConstants'),
    TournamentsConstants = require('../constants/TournamentsConstants'),

    routes               = require('../utils/api-routes'),
    api                  = require('../utils/api').init(routes.routes, routes.basePath);


var _tournaments     = [],
    _validationError = null;

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _tournaments;
    },

    getByLeague: function (id) {
        return _.filter(_tournaments, function (item) {
            return item.leagueId == id;
        });
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
            name:     notEmpty,
            slug:     notEmpty,
            leagueId: notEmpty,
            state:    notEmpty
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
        case TournamentsConstants.TOURNAMENTS_LOAD:
            var call = api.call('tournaments:list').done(function (result) {
                _tournaments = result;
                Store.emitChange();
            });

            Store.emitEvent(EventsConstants.EVENT_CALL, call);
            break;

        case TournamentsConstants.TOURNAMENTS_ADD:

            var tournaments = _tournaments.slice(0);

            var tournament = {
                name:     action.data.name,
                slug:     action.data.slug,
                country:  action.data.countryId,
                leagueId: action.data.leagueId,
                sort:     tournaments.length ? tournaments.sort(function (a, b) {
                    return a.sort > b.sort ? 1 : -1;
                }).pop().sort + 1 : 1
            };

            if (Store._validate(tournament)) {
                api.call('tournaments:create', tournament).then(function (res) {
                    _tournaments.push(res);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case TournamentsConstants.TOURNAMENTS_SAVE:
            var tournament = assign({}, action.data),
                options = assign({}, {validate: true, silent: false}, action.options);

            if (action.data.country) {
                action.data.country = action.data.country._id;
            } else {
                delete action.data.country;
            }

            if (!options.validate || Store._validate(action.data)) {
                api.call('tournaments:save', action.data).then(function () {
                    var changed = _tournaments.filter(function (item) {
                        return item._id == tournament._id;
                    }).pop();

                    assign(changed, tournament);
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
