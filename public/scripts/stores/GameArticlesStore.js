"use strict";

var _                     = require('underscore'),
    assign                = require('object-assign'),
    EventEmitter          = require('events').EventEmitter,

    AppDispatcher         = require('../dispatcher/app-dispatcher'),

    EventsConstants       = require('../constants/EventsConstants'),
    GameArticlesConstants = require('../constants/GameArticlesConstants'),

    routes                = require('../utils/api-routes'),
    api                   = require('../utils/api').init(routes.routes, routes.basePath);


var _articles        = [],
    _validationError = null;


var GameArticlesStore = assign({}, EventEmitter.prototype, {

    getAll: function (type) {
        if (typeof type === "string") {
            return _articles.filter(function (item) {
                return item.type == type;
            })
        }
        return _articles;
    },

    get: function (gameId, type) {
        return _.findWhere(_articles, {gameId: gameId, type: type});
    },

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
        var hasImage = function (value, article) {
            return article.type != 'preview' || !!value;
        };

        var rules = {
            body:      notEmpty,
            imageHome: hasImage,
            imageAway: hasImage
        };

        var result = true,
            ruleResult;
        for (var rule in rules) {
            if (article.hasOwnProperty(rule)) {
                ruleResult = rules[rule](article[rule], article);
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
        case GameArticlesConstants.GAME_ARTICLES_LOAD:

            api.call('game-articles:list').done(function (result) {
                _articles = result;
                GameArticlesStore.emitChange();
            });
            break;

        case GameArticlesConstants.GAME_ARTICLES_SAVE:

            if (GameArticlesStore._validate(action.data)) {
                api.call('game-articles:save', action.data).then(function (res) {

                    var changed = _articles.filter(function (item) {
                        return item._id == action.data._id;
                    }).pop();

                    assign(changed, action.data);
                    GameArticlesStore.emitChange();
                });
            } else {
                GameArticlesStore.emitValidation(GameArticlesStore._getValidationError());
            }

            break;

        case GameArticlesConstants.GAME_ARTICLES_ADD:

            if (GameArticlesStore._validate(action.data)) {
                api.call('game-articles:create', action.data).then(function (res) {
                    _articles.push(res);
                    GameArticlesStore.emitChange();
                });
            } else {
                GameArticlesStore.emitValidation(GameArticlesStore._getValidationError());
            }

            break;

        case GameArticlesConstants.GAME_ARTICLES_DELETE:
            api.call('game-articles:delete', {_id: action.data._id}).then(function () {
                _articles = _.filter(_articles, function (item) {
                    return item._id != action.data._id
                });

                GameArticlesStore.emitChange();
            });

            break;

        default:
            break;
    }
});

module.exports = GameArticlesStore;
