"use strict";

var _             = require('underscore'),
    moment        = require('moment'),
    EventEmitter  = require('events').EventEmitter,

    AppDispatcher = require('../dispatcher/app-dispatcher'),

    NewsConstants = require('../constants/NewsConstants');


var _news        = [],
    CHANGE_EVENT = 'change';


var NewsStore = _.extend(EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (cb) {
        this.on(CHANGE_EVENT, cb);
    },

    removeChangeListener: function (cb) {
        this.removeListener(CHANGE_EVENT, cb);
    },

    getAll: function () {
        return _news;
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
            var article = {
                id:    _news.slice(0).sort(function (a, b) {
                    return a.id > b.id ? 1 : -1;
                }).pop().id + 1,
                title: action.data.title,
                body:  action.data.body,
                dc:    moment().format('DD-MM-YYYY'),
                sort:  _news.slice(0).sort(function (a, b) {
                    return a.sort > b.sort ? 1 : -1;
                }).pop().sort + 1
            };

            _news.push(article);

            NewsStore.emitChange();
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