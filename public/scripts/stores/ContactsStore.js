"use strict";

var _                 = require('underscore'),
    assign            = require('object-assign'),
    EventEmitter      = require('events').EventEmitter,

    AppDispatcher     = require('../dispatcher/app-dispatcher'),

    EventsConstants   = require('../constants/EventsConstants'),
    ContactsConstants = require('../constants/ContactsConstants'),

    routes            = require('../utils/api-routes'),
    api               = require('../utils/api').init(routes.routes, routes.basePath);

var _contacts        = [],
    _validationError = null;

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _contacts;
    },

    getByLeague: function (leagueId) {
        return _contacts.filter(function (item) {
            return item.leagueId == leagueId;
        });
    },

    getByTournament: function (tournamentId) {
        return _contacts.filter(function (item) {
            return item.tournamentId == tournamentId;
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
        var err          = _validationError;
        _validationError = null;

        return err;
    },

    /**
     * @param {Object} New contact object
     * @returns {boolean}
     *
     * @private
     */
    _validate: function (contact) {
        var notEmpty = function (value) {
            return value && value.toString().length > 0;
        };

        var rules = {
            name:  notEmpty,
            email: notEmpty,
            title: notEmpty,
            image: notEmpty
        };

        return this._isValid(contact, rules);
    },

    _isValid: function (entity, rules) {

        var result = true,
            ruleResult;

        for (var rule in rules) {
            if (entity.hasOwnProperty(rule)) {
                ruleResult = rules[rule](entity[rule]);
                if (!ruleResult) {
                    _validationError       = _validationError || {};
                    _validationError[rule] = true;
                    result                 = false;
                }
            }
        }

        return result;
    }
});

AppDispatcher.register(function (action) {
    switch (action.type) {
        case ContactsConstants.CONTACTS_LOAD:
            api.call('contacts:list').done(function (result) {
                _contacts = result;
                Store.emitChange();
            });

            break;

        case ContactsConstants.CONTACTS_ADD:
            var contacts = _contacts.slice(0);

            if (Store._validate(action.data)) {
                api.call('contacts:create', action.data, true).then(function (res) {
                    _contacts.push(res);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case ContactsConstants.CONTACTS_SAVE:
            var contact = action.data;
            var options = assign({}, {silent: false}, action.options);

            if (Store._validate(contact)) {
                api.call('contacts:save', contact, true).then(function () {
                    var changed = _.findWhere(_contacts, {_id: contact._id});

                    assign(changed, contact);

                    if (!options.silent) {
                        Store.emitChange();
                    }
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case ContactsConstants.CONTACTS_DELETE:
            api.call('contacts:delete', {_id: action.data._id}).then(function () {
                _contacts = _.filter(_contacts, function (item) {
                    return item._id != action.data._id;
                });

                Store.emitChange();
            });
            break;

        default:
            break;
    }
});

module.exports = Store;
