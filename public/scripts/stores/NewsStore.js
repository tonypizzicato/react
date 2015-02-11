"use strict";

var _             = require('underscore'),
    moment        = require('moment'),
    EventEmitter  = require('events').EventEmitter,

    AppDispatcher = require('../dispatcher/app-dispatcher'),

    NewsConstants = require('../constants/NewsConstants'),

    api           = require('../utils/api');


var _news            = [],
    _validationError = null,
    EVENT_CHANGE     = 'change',
    EVENT_VALIDATION = 'validation';


var NewsStore = _.extend(EventEmitter.prototype, {
    emitChange: function () {
        this.emit(EVENT_CHANGE);
    },

    emitValidation: function (error) {
        this.emit(EVENT_VALIDATION, error);
    },

    addChangeListener: function (cb) {
        this.on(EVENT_CHANGE, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(EVENT_CHANGE, cb);
    },

    addValidationListener: function (cb) {
        this.on(EVENT_VALIDATION, cb);
    },

    removeValidationListener: function (cb) {
        this.removeListener(EVENT_VALIDATION, cb);
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

        var notEmptyObject = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    return true;
                }
            }
            return false;
        }

        var rules = {
            title: notEmpty,
            body:  notEmptyObject
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
        case NewsConstants.NEWS_LOAD:
            console.log('"' + action.type + '" handled');
            api.call('news:list').done(function (result) {
                _news = result;
                NewsStore.emitChange();
            });
            break;

        case NewsConstants.NEWS_SAVE:
            console.log('"' + action.type + '" handled');
            NewsStore.emitChange();
            break;

        case NewsConstants.NEWS_ADD:
            console.log('"' + action.type + '" handled');
            var news = _news.slice(0);

            var article = {
                title: action.data.title,
                body:  action.data.body,
                show:  action.data.show,
                stick: action.data.stick,
                dc:    moment().format('DD-MM-YYYY '),
                sort:  news.length ? news.sort(function (a, b) {
                    return a.sort > b.sort ? 1 : -1;
                }).pop().sort + 1 : 1
            };

            if (NewsStore._validate(article)) {
                api.call('news:create', article).then(function (res) {
                    _news.push(res);
                    NewsStore.emitChange();
                });
            } else {
                NewsStore.emitValidation(NewsStore._getValidationError());
            }

            break;

        case NewsConstants.NEWS_DELETE:
            api.call('news:delete', {id: action.data.id}).then(function () {
                _news = _.filter(_news, function (item) {
                    return item._id != action.data.id
                });

                NewsStore.emitChange();
            });

            break;

        case NewsConstants.NEWS_SORT:
            console.log('"' + action.type + '" handled');
            var current = _news.filter(function (item) {
                return item.id == action.data.id;
            }).pop();
            var old = _news.filter(function (item) {
                return item.id != action.data.id && item.sort == current.sort - action.data.dir;
            }).pop();

            if (old) {
                old.sort = current.sort;
                current.sort -= action.data.dir;

                NewsStore.emitChange();
            }
            break;

        default:
            console.log('action "' + action.type + '" was not handled in News store');
    }
});

module.exports = NewsStore;