"use strict";

var _                 = require('underscore'),
    assign            = require('object-assign'),
    moment            = require('moment'),
    EventEmitter      = require('events').EventEmitter,

    AppDispatcher     = require('../dispatcher/app-dispatcher'),

    EventsConstants   = require('../constants/EventsConstants'),
    PreviewsConstants = require('../constants/PreviewsConstants'),

    api               = require('../utils/api');


var _previews        = [],
    _validationError = null;


var PreviewsStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(EventsConstants.EVENT_CHANGE);
    },

    emitValidation: function (error) {
        this.emit(EventsConstants.EVENT_VALIDATION, error);
    },

    addChangeListener: function (cb) {
        this.on(EventsConstants.EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_CHANGE, cb);
    },

    addValidationListener: function (cb) {
        this.on(EventsConstants.EVENT_VALIDATION, cb);
    },

    removeValidationListener: function (cb) {
        this.removeListener(EventsConstants.EVENT_VALIDATION, cb);
    },

    getAll: function () {
        return _previews;
    },

    get: function (gameId) {
        return _.findWhere(_previews, {gameId: gameId});
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
     * @param {Object} New article object
     * @returns {boolean}
     *
     * @private
     */
    _validate: function (article) {
        var notEmpty = function (value) {
            return value.length > 0;
        };

        var rules = {
            body: notEmpty
        };

        var result = true,
            ruleResult;
        for (var rule in rules) {
            if (article.hasOwnProperty(rule)) {
                ruleResult = rules[rule](article[rule]);
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
        case PreviewsConstants.PREVIEWS_LOAD:
            console.log('"' + action.type + '" handled');
            api.call('previews:list').done(function (result) {
                _previews = result;
                PreviewsStore.emitChange();
            });
            break;

        case PreviewsConstants.PREVIEWS_SAVE:
            console.log('"' + action.type + '" handled');

            if (PreviewsStore._validate(action.data)) {
                api.call('previews:save', action.data).then(function (res) {
                    _previews.push(res);
                    PreviewsStore.emitChange();
                });
            } else {
                PreviewsStore.emitValidation(PreviewsStore._getValidationError());
            }

            break;

        case PreviewsConstants.PREVIEWS_ADD:
            console.log('"' + action.type + '" handled');
            var previews = _previews.slice(0);

            if (PreviewsStore._validate(action.data)) {
                api.call('previews:create', action.data).then(function (res) {
                    _previews.push(res);
                    PreviewsStore.emitChange();
                });
            } else {
                PreviewsStore.emitValidation(PreviewsStore._getValidationError());
            }

            break;

        case PreviewsConstants.PREVIEWS_DELETE:
            api.call('previews:delete', {_id: action.data._id}).then(function () {
                _previews = _.filter(_previews, function (item) {
                    return item._id != action.data._id
                });

                PreviewsStore.emitChange();
            });

            break;

        default:
            console.log('action "' + action.type + '" was not handled in Previews store');
    }
});

module.exports = PreviewsStore;