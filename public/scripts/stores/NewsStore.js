"use strict";

var _               = require('underscore'),
    assign          = require('object-assign'),
    EventEmitter    = require('events').EventEmitter,

    AppDispatcher   = require('../dispatcher/app-dispatcher'),

    EventsConstants = require('../constants/EventsConstants'),
    NewsConstants   = require('../constants/NewsConstants'),

    routes          = require('../utils/api-routes'),
    api             = require('../utils/api').init(routes.routes, routes.basePath);


var _news            = [],
    _validationError = null;


var NewsStore = assign({}, EventEmitter.prototype, {
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

    getAll: function () {
        return _news;
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
            return !article.stick || (value && value.length);
        };

        var rules = {
            title: notEmpty,
            body:  notEmpty,
            image: hasImage
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
        case NewsConstants.NEWS_LOAD:
            api.call('news:list').done(function (result) {
                _news = result;
                NewsStore.emitChange();
            });
            break;

        case NewsConstants.NEWS_SAVE:
            var article = action.data,
                options = assign({}, {validate: true, silent: false}, action.options);

            if (NewsStore._validate(article)) {
                api.call('news:save', article).then(function () {
                    var changed = _news.filter(function (item) {
                        return item._id == article._id;
                    }).pop();

                    assign(changed, article);
                    if (!options.silent) {
                        NewsStore.emitChange();
                    }
                });
            } else {
                NewsStore.emitEvent(EventsConstants.EVENT_VALIDATION, NewsStore._getValidationError());
            }
            break;

        case NewsConstants.NEWS_ADD:
            var news = _news.slice(0);

            var article = action.data;

            if (NewsStore._validate(article)) {
                api.call('news:create', article).then(function (res) {
                    _news.unshift(res);
                    NewsStore.emitChange();
                });
            } else {
                NewsStore.emitEvent(EventsConstants.EVENT_VALIDATION, NewsStore._getValidationError());
            }

            break;

        case NewsConstants.NEWS_DELETE:
            api.call('news:delete', action.data).then(function () {
                _news = _.filter(_news, function (item) {
                    return item._id != action.data._id
                });

                NewsStore.emitChange();
            });

            break;

        default:
            break;
    }
});

module.exports = NewsStore;
