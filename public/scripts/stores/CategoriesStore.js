"use strict";

var _                 = require('underscore'),
    assign            = require('object-assign'),
    EventEmitter      = require('events').EventEmitter,

    AppDispatcher     = require('../dispatcher/app-dispatcher'),

    EventsConstants   = require('../constants/EventsConstants'),
    CategoriesConstants = require('../constants/CategoriesConstants'),

    routes            = require('../utils/api-routes'),
    api               = require('../utils/api').init(routes.routes, routes.basePath);

var _categories        = [],
    _validationError = null;

var Store = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _categories;
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
     * @param {Object} New category object
     * @returns {boolean}
     *
     * @private
     */
    _validate: function (category) {
        var notEmpty = function (value) {
            return value && value.toString().length > 0;
        };

        var rules = {
            name:  notEmpty
        };

        return this._isValid(category, rules);
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
        case CategoriesConstants.CATEGORIES_LOAD:
            api.call('categories:list').done(function (result) {
                _categories = result;
                Store.emitChange();
            });

            break;

        case CategoriesConstants.CATEGORIES_ADD:
            var categories = _categories.slice(0);

            if (Store._validate(action.data)) {
                api.call('categories:create', action.data, true).then(function (res) {
                    _categories.push(res);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case CategoriesConstants.CATEGORIES_SAVE:
            var category = action.data;

            if (Store._validate(category)) {
                api.call('categories:save', category, true).then(function () {
                    var changed = _.findWhere(_categories, {_id: category._id});

                    assign(changed, category);
                    Store.emitChange();
                });
            } else {
                Store.emitEvent(EventsConstants.EVENT_VALIDATION, Store._getValidationError());
            }
            break;

        case CategoriesConstants.CATEGORIES_DELETE:
            api.call('categories:delete', {_id: action.data._id}).then(function () {
                _categories = _.filter(_categories, function (item) {
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
