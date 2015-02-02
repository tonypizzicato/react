"use strict";

var _             = require('underscore'),
    moment        = require('moment'),
    EventEmitter  = require('events').EventEmitter,

    AppDispatcher = require('../dispatcher/app-dispatcher'),

    NewsConstants = require('../constants/NewsConstants');


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

        var rules = {
            title: notEmpty,
            body:  notEmpty
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
            _news.push({
                    id:     1,
                    title:  "News 1",
                    body:   "News 1 Body",
                    show:   true,
                    sort:   3,
                    dc:     moment().subtract(17, 'days').format('DD-MM-YYYY'),
                    author: "tony.pizzicato"
                }, {
                    id:     2,
                    title:  "News 2",
                    body:   "News 2 Body",
                    show:   false,
                    sort:   2,
                    dc:     moment().subtract(7, 'days').format('DD-MM-YYYY'),
                    author: "tony.pizzicato"
                }
            );
            NewsStore.emitChange();
            break;

        case NewsConstants.NEWS_ADD:
            console.log('"' + action.type + '" handled');
            NewsStore.emitChange();
            break;

        case NewsConstants.NEWS_SAVE:
            console.log('"' + action.type + '" handled');
            var article = {
                id:    _news.slice(0).sort(function (a, b) {
                    return a.id > b.id ? 1 : -1;
                }).pop().id + 1,
                title: action.data.title,
                body:  action.data.body,
                show:  action.data.show,
                stick: action.data.stick,
                dc:    moment().format('DD-MM-YYYY'),
                sort:  _news.slice(0).sort(function (a, b) {
                    return a.sort > b.sort ? 1 : -1;
                }).pop().sort + 1
            };

            if (NewsStore._validate(article)) {
                _news.push(article);

                NewsStore.emitChange();
            } else {
                NewsStore.emitValidation(NewsStore._getValidationError());
            }

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